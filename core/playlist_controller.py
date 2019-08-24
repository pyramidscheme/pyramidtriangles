import sqlite3
from typing import List, Tuple, Optional


class PlaylistController:
    """
    Controller to handle in-memory database lookups for playlists.

    This class and methods are thread-safe. At least one connection must be kept open for the DB to stay in memory.
    """
    def __init__(self):
        self.uri = 'file::memory:?cache=shared'

        # Assigning this connection to self so the object retains a reference to at least one connection.
        # If no connections remain, the in-memory DB will be cleared.
        self.db = self._connect()
        with self.db:
            self.db.execute('CREATE TABLE IF NOT EXISTS playlist (show text NOT NULL)')

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.uri, uri=True)

    def current_playlist(self) -> List[Tuple[int, str]]:
        """
        Returns the current playlist of shows. [(id, show),...].
        """

        cursor = self._connect().cursor()
        cursor.execute('SELECT rowid, show FROM playlist ORDER BY rowid')
        return cursor.fetchall()

    def pop(self) -> Optional[str]:
        """
        Gets the top item from the playlist and removes it.
        """
        db = self._connect()
        with db:
            cursor = db.cursor()
            cursor.execute('SELECT rowid, show FROM playlist ORDER BY rowid LIMIT 1')
            row = cursor.fetchone()
            if row is None:
                return None

            (entry_id, show) = row
            cursor.execute('DELETE FROM playlist WHERE rowid = (?)', (entry_id,))

        return show

    def put(self, show: str) -> None:
        """
        Appends a show to the playlist.
        """
        db = self._connect()
        with db:
            db.execute('INSERT INTO playlist VALUES (?)', (show,))

    def delete(self, entry_id: int) -> None:
        """
        Deletes a show from the playlist by playlist/{entry_id}, or all shows by /playlist/.
        """
        db = self._connect()
        with db:
            db.execute('DELETE FROM playlist WHERE rowid = (?)', (entry_id,))

    def clear(self) -> None:
        db = self._connect()
        with db:
            db.execute('DELETE FROM playlist')
