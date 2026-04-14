import { useBookmarks } from '@/entities/bookmark';
import type { Bookmark } from '@/entities/bookmark';
import BookmarkCard from './BookmarkCard';
import Section from '@/shared/ui/Section';

function BookmarksSection() {
  const { bookmarks } = useBookmarks();

  return (
    <Section title="즐겨찾기">
      {bookmarks.length === 0 && (
        <div className="mt-4 min-h-24 flex items-center justify-center" role="status">
          <p className="text-center text-gray-500 text-sm">즐겨찾기한 지역이 없어요</p>
        </div>
      )}

      {bookmarks.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {bookmarks.map((bookmark: Bookmark) => (
            <BookmarkCard key={bookmark.regionValue} bookmark={bookmark} />
          ))}
        </div>
      )}
    </Section>
  );
}

export default BookmarksSection;
