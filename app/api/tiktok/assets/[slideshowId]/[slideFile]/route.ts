const DEFAULT_SCROLLSMART_ASSET_ORIGIN = "https://nona-cronish-detachedly.ngrok-free.dev";

type RouteContext = {
  params: Promise<{
    slideshowId: string;
    slideFile: string;
  }>;
};

function getAssetOrigin() {
  const value = process.env.SCROLLSMART_ASSET_ORIGIN || DEFAULT_SCROLLSMART_ASSET_ORIGIN;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slideshowId, slideFile } = await context.params;
  if (!/^slide-\d+\.jpe?g$/i.test(slideFile)) {
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
