from __future__ import annotations

import os

import pathway as pw


def configure_pathway_license_from_env() -> None:
    """Configure Pathway enterprise/xPack features using an env-provided license key.

    Pathway's LLM xPack / enterprise features may require a license key.
    This helper reads a key from environment (without logging it) and applies it.

    Supported env vars (first non-empty wins):
    - PATHWAY_LICENSE_KEY
    - PATHWAY_API_KEY
    """

    key = (os.getenv("PATHWAY_LICENSE_KEY") or "").strip() or (os.getenv("PATHWAY_API_KEY") or "").strip()
    if not key:
        return

    # Available in Pathway (see pw.set_license_key in API docs).
    pw.set_license_key(key)
