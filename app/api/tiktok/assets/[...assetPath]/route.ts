const DEFAULT_SCROLLSMART_ASSET_ORIGIN = "https://nona-cronish-detachedly.ngrok-free.dev";

type RouteContext = {
  params: Promise<{
    assetPath: string[];
  }>;
};

function getAssetOrigin() {
  const value = process.env.SCROLLSMART_ASSET_ORIGIN || DEFAULT_SCROLLSMART_ASSET_ORIGIN;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function verificationResponse(assetPath: string[]) {
  const fileName = process.env.TIKTOK_URL_VERIFICATION_FILE;
  const body = process.env.TIKTOK_URL_VERIFICATION_BODY;
  if (!fileName || !body || assetPath.length !== 1 || assetPath[0] !== fileName) return null;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export async function GET(_request: Request, context: RouteContext) {
  const { assetPath } = await context.params;
  const verification = verificationResponse(assetPath);
  if (verification) return verification;

  const [slideshowId, slideFile] = assetPath;
  if (assetPath.length !== 2 || !slideshowId || !slideFile || !/^slide-\d+\.jpe?g$/i.test(slideFile)) {
    return Response.json({ error: "Invalid TikTok asset path" }, { status: 400 });
  }

  const upstreamUrl = `${getAssetOrigin()}/api/tiktok/assets/${encodeURIComponent(slideshowId)}/${encodeURIComponent(slideFile)}`;
  const upstream = await fetch(upstreamUrl, {
    redirect: "follow",
    headers: {
      Accept: "image/jpeg",
    },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return Response.json(
      { error: "ScrollSmart asset source unavailable", status: upstream.status },
      { status: upstream.ok ? 502 : upstream.status },
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public, max-age=60",
    },
  });
}
