library.html => main library navigation
libraryfiles.html => leaf element navigation     (the main URL doesn't change but the template is different)


the current mode is stored as a 'mode' cookie where

## Class: Mode
* [Mode.Display] : the current zone label Playing to ...
* [Mode.IsRemote) : whether it's playing in a zone
* [Mode.IsPlay] : whether it's local playing (on the remote)

## Class: ModeZone
The current playing zone

* [ModeZone.ID] : the id
* [ModeZone.Name] : the name

* [ShowPlayingNow] : whether the playing now button should be shown on this screen
* [ShowSearch] : whether the search button should be shown on this screen

## CurrentLibraryItem
* [CurrentLibraryItem.ShowPlay] : is it playable?
* [CurrentLibraryItem.UseThumbnails] :



## Count tokens
* [ZoneCount]: the number of zones
* [LibraryItemCount]: the number of items in a library view
* [PlayingNowFileCount]: the number of files in Playing Now (in the active zone)
* [LibraryFilesCount]: the number of items in a library files view

## Tokens with no class (name only)
* [LibraryLocation]: name of the current location when browsing
* [ProgramFullName]: full name of the program (i.e. J. River Media Center)
* [ProgramName]: name of the program (i.e. Media Center)
* [ProgramVersion]: version of the program (i.e. 15.0.75)
* [ActiveZoneName]: name of the current playback zone
* [PlaybackStatus]: status of playback in the current zone (i.e. Playing, Stopped, etc.)
* [LibraryServerLink]: URL to root of server
* [Token]: access token used for authorization (helpful to append to URLs to avoid the need for authentication)

## Class: Zone(index)
The index is the index (0-based) of the zone.
* [Zone(x).Name]: name of the zone
* [Zone(x).ID]: Identifier of the zone

## Class: LibraryItem(index)
When browsing, the individual items that make up a library view. For example, they could be an artist, album, keyword, etc.

* [LibraryItem(x).Name]: name of item
* [LibraryItem(x).ImageLink]: URL to a thumbnail (JPEG) for the item
* [LibraryItem(x).IntoLink]: URL to navigate into this item
* [LibraryItem(x).ShowPlay]: whether it makes sense to show play commands for this item (0 or 1)
* [LibraryItem(x).PlayLink]: URL to play the library item on the server machine
* [LibraryItem(x).AddLink]: URL to add the library item to Playing Now on the server machine
* [LibraryItem(x).ShuffleLink]: URL to play (with shuffle) the library item on the server machine
* [LibraryItem(x).M3ULink]: URL that will provide an M3U playlist of the files in the library item
* [LibraryItem(x).ASXLink]: URL that will provide an ASX playlist of the files in the library item
* [LibraryItem(x).MPLLink]: URL that will provide an MPL playlist of the files in the library item
* [LibraryItem(x).WebPlayPlayLink]: URL that will play the library item files on the client
* [LibraryItem(x).WebPlayShuffleLink]: URL that will play (with shuffle) the library item files on the client

## Class: PlayingFile
The playing file. Uses same variable names as 'LibraryFile', so see below for variable names.

## Class: PlayingNowFile(index)
The file at the specified index in Playing Now (zero based). Uses same variable names as 'LibraryFile', so see below for variable names.

## Class: LibraryFile(index)
The file at the specified index in the current LibraryItem (zero based).

* [LibraryFile(x).FileKey]: key of the file in the database (immutable, and safe to use between sessions)
* [LibraryFile(x).ImageLink]: URL to a thumbnail (JPEG) of the file
* [LibraryFile(x).Artist]: artist of the file
* [LibraryFile(x).Name]: name of the file
* [LibraryFile(x).PlayLink]: URL to play the file on the server
* [LibraryFile(x).AddLink]: URL to add the file to Playing Now on the server
* [LibraryFile(x).FileLink]: URL to provide the file to the client (on Android, provides MPL playlist pointing to file)

## Class: Pagination
Tools and variables for splitting large lists into multiple pages.

* [Pagination.StartIndex]: the first index of the current page (can be used in loops)
* [Pagination.FinishIndex]: the last index of the current page (can be used in loops)
* [Pagination.ShowControls(item count)]: whether a page should show pagination controls for the given item count
* [Pagination.Controls(item count)]: links for the list of pages given an item count ( i.e. Previous 1 2 3 Next )