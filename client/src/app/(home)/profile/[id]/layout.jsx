import axios from 'axios';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    // Attempt to fetch public profile data for metadata
    // Using the same base URL as the frontend logic
    const response = await axios.get(`http://127.0.0.1:8000/api/profile/${id}`);
    const profile = response.data;

    return {
      title: `${profile.display_name} (@${profile.name}) | Tawassol`,
      description: profile.bio || `View ${profile.display_name}'s profile on Tawassol - The social network for professionals.`,
      openGraph: {
        images: [`http://127.0.0.1:8000/storage/${profile.avatar_url}`],
      },
    };
  } catch (error) {
    return {
      title: "User Profile | Tawassol",
      description: "View user profile on Tawassol.",
    };
  }
}

export default function ProfileLayout({ children }) {
  return <>{children}</>;
}
