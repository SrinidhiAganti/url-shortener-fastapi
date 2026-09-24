const form = document.getElementById("shorten-form");
const input = document.getElementById("url-input");
const button = document.getElementById("shorten-btn");
const message = document.getElementById("form-message");
const result = document.getElementById("result");
const shortUrl = document.getElementById("short-url");
const copyButton = document.getElementById("copy-btn");
const linksList = document.getElementById("links-list");
const emptyState = document.getElementById("empty-state");
const totalLinks = document.getElementById("total-links");
const totalClicks = document.getElementById("total-clicks");
const refreshButton = document.getElementById("refresh-btn");

function absoluteUrl(path) {
    return new URL(path, window.location.origin).href;
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

async function loadLinks() {
    try {
        const response = await fetch("/urls");

        if (!response.ok) {
            throw new Error("Could not load links");
        }

        const links = await response.json();

        totalLinks.textContent = links.length;
        totalClicks.textContent = links.reduce(
            (sum, item) => sum + item.click_count,
            0
        );

        if (links.length === 0) {
            emptyState.classList.remove("hidden");
            linksList.innerHTML = "";
            return;
        }

        emptyState.classList.add("hidden");

        linksList.innerHTML = links.map((item) => {
            const fullShortUrl = absoluteUrl(item.short_url);

            return `
                <article class="link-item">
                    <div class="link-main">
                        <a class="short-link"
                           href="${fullShortUrl}"
                           target="_blank"
                           rel="noopener">
                           ${escapeHtml(fullShortUrl)}
                        </a>
                        <span class="original-link"
                              title="${escapeHtml(item.original_url)}">
                              ${escapeHtml(item.original_url)}
                        </span>
                    </div>
                    <div class="link-meta">
                        <span class="click-badge">
                            ${item.click_count} click${item.click_count === 1 ? "" : "s"}
                        </span>
                        <a class="docs-link"
                           href="/urls/${encodeURIComponent(item.short_code)}/stats"
                           target="_blank">
                           Stats
                        </a>
                    </div>
                </article>
            `;
        }).join("");
    } catch (error) {
        message.textContent = error.message;
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.textContent = "";
    result.classList.add("hidden");
    button.disabled = true;
    button.textContent = "Shortening...";

    try {
        const response = await fetch("/urls", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                original_url: input.value.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to shorten URL"
            );
        }

        const fullShortUrl = absoluteUrl(data.short_url);

        shortUrl.href = fullShortUrl;
        shortUrl.textContent = fullShortUrl;
        result.classList.remove("hidden");

        input.value = "";
        await loadLinks();
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
        button.textContent = "Shorten URL";
    }
});

copyButton.addEventListener("click", async () => {
    const value = shortUrl.href;

    try {
        await navigator.clipboard.writeText(value);
        copyButton.textContent = "Copied!";
        setTimeout(() => {
            copyButton.textContent = "Copy";
        }, 1500);
    } catch {
        copyButton.textContent = "Copy failed";
    }
});

refreshButton.addEventListener("click", loadLinks);

loadLinks();
