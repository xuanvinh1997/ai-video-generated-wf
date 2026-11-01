# gioi-thieu-workflow

## Brief
- **Mục tiêu:** Video thử nghiệm giới thiệu project "AI video workflow": coding agent tạo video bằng Remotion và kết nối Meta qua MCP.
- **Đối tượng:** Developer / marketer quan tâm tới tự động hóa làm video.
- **Nền tảng:** Reels / Stories / Shorts
- **Định dạng:** 9:16, 1080x1920, 30 fps, 15 giây (450 frame)
- **Ngôn ngữ:** Tiếng Anh (chữ trên màn hình và voiceover). Slug `gioi-thieu-workflow` giữ nguyên.
- **Tông giọng:** Hiện đại, ngắn gọn, tự tin
- **CTA:** "Try it now: Claude Code + Remotion"
- **Brand/asset:** Không có; dùng nền tối, màu nhấn xanh dương/tím, chữ sans-serif. Ảnh nền do AI tạo (xem Trạng thái).
- **Âm thanh:** Voiceover tiếng Anh (OpenRouter, tier `cheap`: `hexgrad/kokoro-82m`, giọng `af_heart`). Không có nhạc nền.

## Storyboard

| # | Giây | Chữ trên màn hình | Hình ảnh | Voiceover (EN, bắt đầu sau 0,2s) |
|---|---|---|---|---|
| 1 | 0–3 | "AI video,<br>written in code." | Ảnh AI "dải film/code phát sáng" zoom chậm làm nền; tiêu đề vào từng dòng (spring), vạch sáng chạy ngang | "AI video, written in code." |
| 2 | 3–6 | "1. Describe your idea" | Khung "terminal" gõ từng ký tự: `> Make a 15s product intro video` | "First, describe your idea." |
| 3 | 6–9 | "2. Agent builds it in Remotion" | Ba khối timeline (Scene 1, 2, 3) trượt vào và xếp thành track, playhead chạy qua | "An agent builds it in Remotion." |
| 4 | 9–12 | "3. Connect Meta via MCP" | Ảnh AI "mạng lưới nút sáng" làm nền; ba thẻ Ads, Social, WhatsApp bật lên lần lượt, nối bằng đường kẻ tới một nút trung tâm | "Then connect Meta through MCP." |
| 5 | 12–15 | "Try it now:<br>Claude Code + Remotion" | Ảnh AI "tia sáng và hạt" làm nền; tiêu đề phóng nhẹ vào, chữ CTA trong nút bo tròn, mờ dần ở cuối | "Try Claude Code and Remotion." |

Ghi chú: các thẻ ở cảnh 4 chỉ là minh họa; chưa đăng nhập hay gọi Meta MCP.

## Trạng thái
- Composition: `gioi-thieu-workflow` (`video/src/gioi-thieu-workflow/`), đã đăng ký trong `video/src/Root.tsx`.
- Preview: `cd video && npm run dev`, mở `/gioi-thieu-workflow`.
- Voiceover: `video/src/gioi-thieu-workflow/voiceover.json` → `cd video && node --env-file=../.env scripts/voiceover.mjs gioi-thieu-workflow [--tier standard]`. File mp3 nằm ở `video/public/gioi-thieu-workflow/`; mỗi câu 2,1–2,4s, vừa khung 3s của cảnh.
- Ảnh nền AI: `video/src/gioi-thieu-workflow/images.json` → `cd video && node --env-file=../.env scripts/genimage.mjs gioi-thieu-workflow [--tier standard] [--only intro] --yes`. Đã tạo 3 ảnh (`art-intro/network/burst.jpg`) bằng `black-forest-labs/flux-3-image-klein` (tier `cheap`), 768x1365, tổng $0,027. Dùng ở cảnh 1, 4, 5 qua `SceneArt.tsx`.
- File Meta: `cd video && node scripts/export.mjs gioi-thieu-workflow --preset reels` → `out/gioi-thieu-workflow-reels.mp4` (1080x1920, H.264/AAC, 15s, 5,3 MB, đủ 8 mục PASS).
