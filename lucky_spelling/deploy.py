from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

from .audio import SUPPORTED_AUDIO_SUFFIXES


class DeployError(RuntimeError):
    pass


def deploy(repo: str, *, docs_dir: str | Path = "docs", cwd: str | Path | None = None) -> str:
    root = Path(cwd or Path.cwd())
    docs = root / docs_dir
    _validate_docs(docs)
    _require_command("git")
    _require_command("gh")

    _run(["gh", "auth", "status"], cwd=root)
    owner = _run(["gh", "api", "user", "--jq", ".login"], cwd=root).stdout.strip()
    if not owner:
        raise DeployError("Could not determine GitHub username with `gh api user --jq .login`.")

    if not (root / ".git").exists():
        _run(["git", "init"], cwd=root)
        _run(["git", "branch", "-M", "main"], cwd=root)

    _run(["git", "add", "."], cwd=root)
    status = _run(["git", "status", "--porcelain"], cwd=root).stdout.strip()
    if status:
        _run(["git", "commit", "-m", "Update Lucky spelling test"], cwd=root)

    full_name = f"{owner}/{repo}"
    repo_exists = _run(["gh", "repo", "view", full_name], cwd=root, check=False).returncode == 0

    if repo_exists:
        remote_url = f"https://github.com/{full_name}.git"
        if _run(["git", "remote", "get-url", "origin"], cwd=root, check=False).returncode == 0:
            _run(["git", "remote", "set-url", "origin", remote_url], cwd=root)
        else:
            _run(["git", "remote", "add", "origin", remote_url], cwd=root)
        _run(["git", "push", "-u", "origin", "main"], cwd=root)
    else:
        _run(["gh", "repo", "create", repo, "--public", "--source=.", "--remote=origin", "--push"], cwd=root)

    pages_path = f"/repos/{full_name}/pages"
    page_exists = _run(["gh", "api", pages_path], cwd=root, check=False).returncode == 0
    method = "PUT" if page_exists else "POST"
    _run(
        [
            "gh",
            "api",
            "--method",
            method,
            pages_path,
            "-f",
            "build_type=legacy",
            "-F",
            "source[branch]=main",
            "-F",
            "source[path]=/docs",
        ],
        cwd=root,
    )

    url_result = _run(["gh", "api", pages_path, "--jq", ".html_url"], cwd=root)
    url = url_result.stdout.strip() or f"https://{owner}.github.io/{repo}/"
    return url.rstrip("/") + "/"


def _validate_docs(docs: Path) -> None:
    if not (docs / "index.html").exists():
        raise DeployError(f"Missing {docs / 'index.html'}. Run `python -m lucky_spelling generate` first.")
    audio_dir = docs / "audio"
    if not audio_dir.exists():
        raise DeployError(f"Missing {audio_dir}. Run generation with audio first.")
    has_audio = any(path.suffix.lower() in SUPPORTED_AUDIO_SUFFIXES for path in audio_dir.iterdir())
    if not has_audio:
        raise DeployError(f"No audio files found in {audio_dir}.")


def _require_command(command: str) -> None:
    if not shutil.which(command):
        raise DeployError(f"`{command}` is not installed or is not on PATH.")


def _run(args: list[str], *, cwd: Path, check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(args, cwd=cwd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if check and result.returncode != 0:
        command = " ".join(args)
        detail = result.stderr.strip() or result.stdout.strip()
        raise DeployError(f"Command failed: {command}\n{detail}")
    return result

