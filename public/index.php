<?php
/**
 * Hostinger/LiteSpeed often prefers index.php for DirectoryIndex.
 * Serving the Vite SPA here fixes a bare "/" 403 when index.html alone is blocked.
 */
declare(strict_types=1);

$path = __DIR__ . '/index.html';
if (!is_readable($path)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'index.html missing. Upload the Vite dist/ contents to public_html.';
    exit;
}

header('Content-Type: text/html; charset=UTF-8');
readfile($path);
