<div align="center">
  <h1>🌟 Project Nova</h1>
  <p><strong>Open-source local AI desktop app. Fully offline. Fully yours.</strong></p>

  ![License](https://img.shields.io/badge/license-MIT-blue)
  ![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)
  ![Status](https://img.shields.io/badge/status-planned-red)
</div>

---

## What is Project Nova?

Project Nova is a planned free, open-source desktop application that brings a full suite of AI tools together — running entirely on your own machine. No subscriptions. No cloud. No data leaving your PC.

Built for creators, researchers, and developers who want real AI power without the privacy trade-offs.

> ⚠️ **This project is in early planning stages. No code exists yet. Contributions, feedback, and ideas are welcome!**

---

## Planned Features

| | Feature | Description |
|---|---|---|
| 💬 | **AI Chat** | Chat with local LLMs. Reason, search the web, read any file |
| 🔍 | **Research Mode** | Give Nova a topic — it searches, reads, and writes a full report |
| 🎙️ | **Voice Studio** | Clone voices, generate speech, export audio |
| 🎨 | **Image Studio** | Generate, edit, upscale, remove backgrounds, swap faces |
| 🎬 | **Video Studio** | Text & image to video, AI captions |
| 🗄️ | **Storage** | Curated content collections the AI can reference |
| 📝 | **Prompt Library** | Save and reuse prompts across all tools |
| 🤖 | **Model Manager** | Install, remove and manage all your local AI models |

---

## Planned Models

| Feature | Model |
|---|---|
| Chat | LLaMA 3.1 8B, Qwen2.5 7B, Mistral 7B |
| Reasoning | DeepSeek R1 8B |
| Web Search | SearXNG (self-hosted) |
| Image Generation | FLUX.1 Schnell, SDXL |
| Image to Text | LLaVA 1.6 |
| Background Removal | RMBG-2.0 |
| Image Upscaling | Real-ESRGAN |
| Face Swap | SimSwap |
| Video Generation | Wan2.1 1.3B |
| Voice Cloning | Chatterbox |
| File Parsing | Apache Tika + Whisper |

All models are free and will run 100% locally.

---

## Planned Tech Stack

- **Desktop** — [Tauri](https://tauri.app/) (Rust)
- **Frontend** — React + Tailwind CSS
- **LLMs** — [Ollama](https://ollama.com/)
- **Image & Video** — [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
- **Web Search** — [SearXNG](https://searxng.org/)
- **File Parsing** — Apache Tika + Whisper
- **Vector Store** — ChromaDB
- **Database** — SQLite

---

## Target Hardware

- **RAM**: 16GB minimum, 32GB recommended
- **GPU**: NVIDIA GPU with 8GB+ VRAM (12GB recommended)
- **Storage**: 20GB+ free for models
- **CUDA**: 11.8+

> Optimized for RTX 3060 12GB + 32GB RAM

---

## Roadmap

- [x] Project planning & spec
- [ ] Repository setup & architecture design
- [ ] Core UI shell
- [ ] AI Chat + Ollama integration
- [ ] Web search + file reading (RAG)
- [ ] Research Mode
- [ ] Image Studio
- [ ] Voice Studio
- [ ] Video Studio
- [ ] Storage & Prompt Library
- [ ] Model Manager
- [ ] Windows installer
- [ ] macOS & Linux support

---

## Contributing

The project hasn't started yet but contributions, ideas, and feedback are already welcome! Feel free to open an issue to discuss features, report suggestions, or ask questions.

Once development begins, a full `CONTRIBUTING.md` will be added.

---

## License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ by the community · Star ⭐ the repo if you find it useful</sub>
</div>
