# 🌱 Digital Sobriety & Sustainability

At OCLKA, we believe that high-performance software should also be responsible software. The digital industry's carbon footprint is growing, and as developers, we have a role to play in building a more sustainable future.

This document outlines our commitment to **Digital Sobriety** and how it influences our technical decisions.

## 🎯 Our Core Principles

### 1. Zero Bloat Philosophy

We combat "software obesity" by keeping our packages as small as possible.

- **Minimal Dependencies**: Every dependency is scrutinized. We prefer writing a few lines of logic over adding a heavy package.
- **Small Bundle Sizes**: Our packages are designed to be lightweight, reducing energy consumption during download, installation, and execution.

### 2. Runtime Efficiency

Code that runs faster consumes less CPU time and energy.

- **Optimized Algorithms**: We prioritize O(1) or O(n) operations to ensure minimal CPU cycles.
- **Resource Management**: We focus on efficient memory usage and timely cleanup of internal generation buffers.

### 3. Smart Seeding & Determinism

We aim to reduce the overall computational load and storage footprint.

- **Deterministic Seeding**: By using a seed-based approach, zeed ensures that the same schema produces the same data consistently. This reduces the need for constant regenerations and helps developers maintain a stable, low-overhead testing environment.
- **Lazy Generation**: Our "Contextual Lazy Generation" (SPEC006) ensures that we only compute the data actually requested by the generators, avoiding wasteful CPU cycles on unused fields.

### 4. Sustainable CI/CD

Our development process is also optimized for energy saving.

- **Turbo-powered**: Using [Turbo](https://turbo.build/repo), we ensure that we never test or build the same code twice, drastically reducing the energy consumed by our CI pipelines.
- **Selective CI**: We only run necessary tasks based on changed files.

## 🟢 Green Code Badge

If you use OCLKA tools and share our values, you can add this badge to your project to show your commitment to digital sobriety:

`![Digital Sobriety](https://img.shields.io/badge/eco--friendly-green_code-brightgreen)`

## 🚀 Future Goals

We are constantly looking for ways to improve:

- Implementing automatic performance regression checks in CI.
- Providing "Carbon Cost" estimations for common operations.
- Promoting eco-design patterns in our examples.

---

_"Simple, efficient code is the most sustainable code."_

Made with ❤️ & 🧠 by [OCLKA](https://oclka.dev)
