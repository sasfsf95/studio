import os
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import label, binary_dilation

WORKSPACE = r"d:\chatai\code\studio-master\studio-master"
SRC_IMAGE = r"C:\Users\Savin Kumar\.gemini\antigravity-ide\brain\3c4d2b3d-6f6b-45ab-b169-8e899a73c8b9\.user_uploaded\media_1793167416955.jpg"

print(f"Loading source image from {SRC_IMAGE}...")
img = Image.open(SRC_IMAGE).convert('RGB')
arr = np.array(img, dtype=float)

# 1. Unblend pure white corners for standard squircle icon
gray = np.mean(arr, axis=2)
pure_white = gray > 245
labeled, _ = label(pure_white)
corner_labels = {labeled[0,0], labeled[0, -1], labeled[-1, 0], labeled[-1, -1]} - {0}
pure_white_corners = np.isin(labeled, list(corner_labels))

transition_zone = binary_dilation(pure_white_corners, iterations=8) & ~pure_white_corners

alpha = np.ones((1024, 1024), dtype=float)
alpha[pure_white_corners] = 0.0

trans_idx = np.where(transition_zone)
for y, x in zip(*trans_idx):
    c = arr[y, x]
    a = 1.0 - (np.mean(c) - 15.0) / (253.0 - 15.0)
    a = np.clip(a, 0.0, 1.0)
    alpha[y, x] = a
    if a > 0.05:
        restored = (c - (1.0 - a) * 253.0) / a
        arr[y, x] = np.clip(restored, 0.0, 255.0)

# Master Squircle (1024x1024 RGBA)
squircle_rgba = np.dstack([arr, alpha * 255.0]).astype(np.uint8)
master_squircle = Image.fromarray(squircle_rgba, 'RGBA')

# Master Round (1024x1024 RGBA) - circular mask
y, x = np.ogrid[:1024, :1024]
dist_center = np.sqrt((x - 511.5)**2 + (y - 511.5)**2)
circle_alpha = np.clip(511.5 - dist_center, 0.0, 1.0)
round_rgba = np.dstack([arr, circle_alpha * 255.0]).astype(np.uint8)
master_round = Image.fromarray(round_rgba, 'RGBA')

# Full Bleed Square (fill corners with midnight background tone)
full_arr = arr.copy()
corner_fill_color = np.array([7.0, 1.0, 32.0])
for y_c in range(1024):
    for x_c in range(1024):
        if pure_white_corners[y_c, x_c]:
            full_arr[y_c, x_c] = corner_fill_color
master_square = Image.fromarray(full_arr.astype(np.uint8), 'RGB')

# 2. Adaptive Foreground extraction
# For adaptive icon, inner motif (heart + orb + aura) is centered and scaled to fit the 72dp safe zone
# Canvas: 108dp. Safe zone: inner 72dp (~66.7%).
B = np.array([7.0, 1.0, 32.0]) # dark background reference
diff = np.linalg.norm(arr - B, axis=2)
r = np.sqrt((x - 518)**2 + (y - 528)**2)
radial_factor = np.clip(1.0 - (r - 360.0) / 80.0, 0.0, 1.0)
fg_alpha = np.clip((diff - 6.0) / 40.0, 0.0, 1.0) * radial_factor

fg_rgb = np.zeros_like(arr)
nonzero = fg_alpha > 0.01
for c in range(3):
    fg_rgb[:, :, c] = np.where(
        nonzero,
        np.clip((arr[:, :, c] - (1.0 - fg_alpha) * B[c]) / np.maximum(fg_alpha, 0.01), 0, 255),
        0
    )

master_fg_motif = Image.fromarray(
    np.dstack([fg_rgb, fg_alpha * 255.0]).astype(np.uint8),
    'RGBA'
)

# Function to create adaptive foreground on target canvas size
def make_adaptive_foreground(canvas_size):
    # Safe zone size is canvas_size * 72 / 108
    # We scale motif to fit comfortably (~64% of canvas size)
    motif_target_size = int(canvas_size * 0.65)
    resized_motif = master_fg_motif.resize((motif_target_size, motif_target_size), Image.Resampling.LANCZOS)
    
    fg_canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    offset = (canvas_size - motif_target_size) // 2
    fg_canvas.paste(resized_motif, (offset, offset), resized_motif)
    return fg_canvas

# Function to create adaptive background on target canvas size
def make_adaptive_background(canvas_size):
    # Midnight background
    bg_canvas = Image.new('RGB', (canvas_size, canvas_size), (7, 1, 32))
    # Add subtle radial ambient glow in center
    bg_arr = np.array(bg_canvas, dtype=float)
    cy, cx = canvas_size / 2.0, canvas_size / 2.0
    yy, xx = np.ogrid[:canvas_size, :canvas_size]
    dd = np.sqrt((xx - cx)**2 + (yy - cy)**2)
    max_d = canvas_size / 2.0
    glow = np.clip(1.0 - dd / max_d, 0.0, 1.0) ** 1.5
    # Ambient glow tone: deep violet (30, 8, 55)
    glow_color = np.array([30.0, 8.0, 55.0])
    base_color = np.array([7.0, 1.0, 32.0])
    for c in range(3):
        bg_arr[:, :, c] = base_color[c] + glow * (glow_color[c] - base_color[c])
    return Image.fromarray(np.clip(bg_arr, 0, 255).astype(np.uint8), 'RGB')

# 3. Generate Android Mipmap Icons
android_res = os.path.join(WORKSPACE, "android", "app", "src", "main", "res")
densities = {
    "mipmap-mdpi": {"launcher": 48, "adaptive": 108},
    "mipmap-hdpi": {"launcher": 72, "adaptive": 162},
    "mipmap-xhdpi": {"launcher": 96, "adaptive": 216},
    "mipmap-xxhdpi": {"launcher": 144, "adaptive": 324},
    "mipmap-xxxhdpi": {"launcher": 192, "adaptive": 432},
}

for folder, sizes in densities.items():
    dir_path = os.path.join(android_res, folder)
    os.makedirs(dir_path, exist_ok=True)
    
    l_size = sizes["launcher"]
    a_size = sizes["adaptive"]
    
    # ic_launcher.png (squircle)
    master_squircle.resize((l_size, l_size), Image.Resampling.LANCZOS).save(
        os.path.join(dir_path, "ic_launcher.png"), "PNG"
    )
    # ic_launcher_round.png (round)
    master_round.resize((l_size, l_size), Image.Resampling.LANCZOS).save(
        os.path.join(dir_path, "ic_launcher_round.png"), "PNG"
    )
    # ic_launcher_foreground.png (adaptive foreground)
    make_adaptive_foreground(a_size).save(
        os.path.join(dir_path, "ic_launcher_foreground.png"), "PNG"
    )
    # ic_launcher_background.png (adaptive background)
    make_adaptive_background(a_size).save(
        os.path.join(dir_path, "ic_launcher_background.png"), "PNG"
    )
    print(f"Generated icons for {folder} ({l_size}px / {a_size}px)")

# Google Play Store Web Icon (512x512)
play_store_icon_path = os.path.join(WORKSPACE, "android", "app", "src", "main", "ic_launcher-web.png")
master_squircle.resize((512, 512), Image.Resampling.LANCZOS).save(play_store_icon_path, "PNG")
print(f"Generated Play Store web icon: {play_store_icon_path}")

# 4. Generate Web / Next.js / PWA Icons
public_dir = os.path.join(WORKSPACE, "public")
src_app_dir = os.path.join(WORKSPACE, "src", "app")
os.makedirs(public_dir, exist_ok=True)
os.makedirs(src_app_dir, exist_ok=True)

# public/logo.png (512x512)
master_squircle.resize((512, 512), Image.Resampling.LANCZOS).save(
    os.path.join(public_dir, "logo.png"), "PNG"
)
# public/icon-192.png (192x192)
master_squircle.resize((192, 192), Image.Resampling.LANCZOS).save(
    os.path.join(public_dir, "icon-192.png"), "PNG"
)
# public/icon-512.png (512x512)
master_squircle.resize((512, 512), Image.Resampling.LANCZOS).save(
    os.path.join(public_dir, "icon-512.png"), "PNG"
)
# public/apple-touch-icon.png (180x180)
master_squircle.resize((180, 180), Image.Resampling.LANCZOS).save(
    os.path.join(public_dir, "apple-touch-icon.png"), "PNG"
)
# public/favicon-32x32.png (32x32)
master_squircle.resize((32, 32), Image.Resampling.LANCZOS).save(
    os.path.join(public_dir, "favicon-32x32.png"), "PNG"
)
# public/favicon-16x16.png (16x16)
master_squircle.resize((16, 16), Image.Resampling.LANCZOS).save(
    os.path.join(public_dir, "favicon-16x16.png"), "PNG"
)

# Favicon .ico with 16, 32, 48 sizes
fav_16 = master_squircle.resize((16, 16), Image.Resampling.LANCZOS)
fav_32 = master_squircle.resize((32, 32), Image.Resampling.LANCZOS)
fav_48 = master_squircle.resize((48, 48), Image.Resampling.LANCZOS)
ico_path_public = os.path.join(public_dir, "favicon.ico")
fav_48.save(ico_path_public, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print(f"Generated {ico_path_public}")

# Next.js App Router metadata icons:
# src/app/icon.png (512x512)
master_squircle.resize((512, 512), Image.Resampling.LANCZOS).save(
    os.path.join(src_app_dir, "icon.png"), "PNG"
)
# src/app/apple-icon.png (180x180)
master_squircle.resize((180, 180), Image.Resampling.LANCZOS).save(
    os.path.join(src_app_dir, "apple-icon.png"), "PNG"
)
# src/app/favicon.ico
ico_path_app = os.path.join(src_app_dir, "favicon.ico")
fav_48.save(ico_path_app, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print(f"Generated {ico_path_app}")

print("ALL ICONS SUCCESSFULLY GENERATED!")
