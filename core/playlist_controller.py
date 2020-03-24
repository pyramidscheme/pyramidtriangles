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
            self.db.execute('CREATE TABLE IF NOT EXISTS Playlist (show text NOT NULL)')
            self.db.execute('''CREATE TABLE IF NOT EXISTS Current (playing integer,
                                 FOREIGN KEY (playing) REFERENCES Playlist(ROWID))''')
            self.db.execute('INSERT INTO Current VALUES (NULL)')

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.uri, uri=True)

    def current_playlist(self) -> List[Tuple[int, str]]:
        """
        Returns the current playlist of shows. [(id, show),...].
        """
        db = self._connect()
        with db:
            cursor = db.cursor()
            cursor.execute('SELECT rowid, show FROM Playlist ORDER BY rowid')
            return cursor.fetchall()

    def current_entry(self) -> Optional[int]:
        """
        Returns the entry_id of the playing show, or None.
        """
        db = self._connect()
        with db:
            cursor = db.cursor()
            cursor.execute('SELECT playing FROM Current LIMIT 1')
            return cursor.fetchone()[0]

    def next(self) -> Optional[str]:
        """
        Gets the next show from the playlist.

        Uses the 'Current' table to determine the next show on the playlist, and advances the Current show.
        If the Current show is NULL, selects the first item in the playlist.
        If the playlist is empty, returns None.
        """
        db = self._connect()
        with db:
            cursor = db.cursor()
            # Get next show from database.
            cursor.execute('''SELECT rowid, show FROM Playlist WHERE rowid >
                IFNULL((SELECT playing FROM Current LIMIT 1),-1)
                LIMIT 1''')
            next_show = cursor.fetchone()

            # Handle looping to the first show if we've reached the end of the playlist.
            if next_show is None:
                cursor.execute('SELECT rowid, show FROM Playlist ORDER BY rowid LIMIT 1')
                next_show = cursor.fetchone()

            # next_show could still be None if Playlist is also empty
            if next_show is None:
                return None

            (entry_id, show) = next_show
            cursor.execute('UPDATE Current SET playing = (?)', (entry_id,))
            return show

    def set_next(self, entry_id: int) -> None:
        """
        Sets the next show in the playlist to be {entry_id}.
        """
        db = self._connect()
        with db:
            cursor = db.cursor()
            # Get previous show from database.
            cursor.execute('SELECT MAX(rowid) FROM Playlist WHERE rowid < (?) LIMIT 1', (entry_id,))
            prev_id = cursor.fetchone()[0]

            # Case where show is first in list
            if prev_id is None:
                cursor.execute('UPDATE Current SET playing = NULL')
            else:
                cursor.execute('UPDATE Current SET playing = (?)', (prev_id,))

    def put(self, show: str) -> None:
        """
        Appends a show to the playlist.
        """
        db = self._connect()
        with db:
            db.execute('INSERT INTO Playlist VALUES (?)', (show,))

    def delete(self, entry_id: Optional[int]) -> None:
        """
        Deletes a show from the playlist by playlist/{entry_id}, or all shows by /playlist/.
        """
        if entry_id is None:
            self.clear()
        else:
            db = self._connect()
            with db:
                db.execute('DELETE FROM Playlist WHERE rowid = (?)', (entry_id,))

    def clear(self) -> None:
        db = self._connect()
        with db:
            db.execute('DELETE FROM Playlist')
            db.execute('UPDATE Current SET playing = NULL')
