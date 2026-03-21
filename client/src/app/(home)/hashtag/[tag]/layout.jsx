export async function generateMetadata({ params }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  return {
    title: `#${decodedTag} | Tawassol`,
    description: `Explore the latest posts, discussions, and community activity related to #${decodedTag} on Tawassol - The professional social network.`,
    keywords: [decodedTag, "Hashtag", "Tawassol", "Community", "Trending"],
  };
}

export default function HashtagLayout({ children }) {
  return <>{children}</>;
}
