import Link from 'next/link';

export default  function HashtagText({ text }) {
  const parts = text?.split(/(#\w+)/g); // Split by hashtags

  return (
    <>
      {parts?.map((part, index) => {
        if (part.startsWith('#')) {
          const tag = part.slice(1);
          return (
            <Link key={index} href={`/hashtag/${tag}`} className="text-blue-500">
              {part}
            </Link>
          );
        }
        return part;
      })}
    </>
  );
}

