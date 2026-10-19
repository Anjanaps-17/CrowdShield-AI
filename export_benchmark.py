import os
import json

# Benchmark results from Member 1 batch run
benchmark_data = [
    {
        "video_name": "Video 1 (Stage Area)",
        "file": "11832-233049403_medium.mp4",
        "total_frames": 634,
        "fps": 8.75,
        "avg_count": 0.0,
        "risk_status": "LOW RISK"
    },
    {
        "video_name": "Video 2 (Walkway Stream)",
        "file": "142030-779071797_medium.mp4",
        "total_frames": 358,
        "fps": 3.91,
        "avg_count": 10.0,
        "risk_status": "MEDIUM RISK"
    },
    {
        "video_name": "Video 3 (Concert Square)",
        "file": "3630-172488409_medium.mp4",
        "total_frames": 763,
        "fps": 10.99,
        "avg_count": 18.7,
        "risk_status": "HIGH RISK"
    },
    {
        "video_name": "Video 4 (Night Crowd)",
        "file": "41823-431406517_medium.mp4",
        "total_frames": 672,
        "fps": 11.06,
        "avg_count": 4.7,
        "risk_status": "LOW RISK"
    }
]

# 1. Print formatted table directly in terminal
print("=" * 80)
print("             CROWDSHIELD AI - YOLOv8 BENCHMARK REPORT (MEMBER 1)")
print("=" * 80)
print(f"{'Video Scene':<25} | {'Frames':<8} | {'FPS':<8} | {'Avg People':<10} | {'Risk Level'}")
print("-" * 80)

for row in benchmark_data:
    print(f"{row['video_name']:<25} | {row['total_frames']:<8} | {row['fps']:<8.2f} | {row['avg_count']:<10.1f} | {row['risk_status']}")

print("=" * 80)

# 2. Export Markdown table
md_content = """### CrowdShield AI - YOLOv8 Video Benchmarking Results (Member 1)

| Video Scene | Total Frames | Speed (FPS) | Avg People/Frame | Risk Status |
| :--- | :--- | :--- | :--- | :--- |
"""
for r in benchmark_data:
    md_content += f"| {r['video_name']} | {r['total_frames']} | {r['fps']:.2f} | {r['avg_count']:.1f} | {r['risk_status']} |\n"

with open("benchmark_results.md", "w") as f:
    f.write(md_content)

# 3. Export LaTeX table for KTU report
latex_content = r"""\begin{table}[htbp]
\centering
\caption{Performance Benchmarking of YOLOv8 Model Across Multiple Video Sequences}
\label{tab:yolov8_benchmarks}
\begin{tabular}{|l|c|c|c|c|}
\hline
\textbf{Video Stream / Dataset} & \textbf{Total Frames} & \textbf{Speed (FPS)} & \textbf{Avg People Count} & \textbf{Risk Status} \\ \hline
"""
for r in benchmark_data:
    latex_content += f"{r['video_name']} & {r['total_frames']} & {r['fps']:.2f} & {r['avg_count']:.1f} & {r['risk_status']} \\\\ \\hline\n"

latex_content += r"""\end{tabular}
\end{table}
"""

with open("benchmark_table.tex", "w") as f:
    f.write(latex_content)

# 4. Export JSON for backend integration
with open("benchmark_data.json", "w") as f:
    json.dump(benchmark_data, f, indent=2)

print("\nSaved files:")
print(" - Markdown table : benchmark_results.md")
print(" - LaTeX report code: benchmark_table.tex")
print(" - JSON data : benchmark_data.json\n")