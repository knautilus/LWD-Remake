/////////////////////////////////////////////////////////////////////////////////
// game.gs
// Users write here basic functions specific for their game. Also check the gamedef.gs
// Advanced users may need to adjust other files as well.
//
// Here are the callback functions that usually stay in this file:
//
// Initialization callbacks:
// RoomsSetNames, ObjectsSetNames, RoomSetCustomText, SaveUserData, LoadUserData, BeginNewGame
//
// Rooms interaction callbacks:
// UpdateRoom_RX_RY()            - called by HandlerGameUpdate while player is in room RX,RY (non-latent)
// AfterRoom_RX_RY()            - called by HandlerGameAfterUpdate while player is in room RX,RY (non-latent)
// OpenRoom_RX_RY()                - called by HandlerRoomOpen when room RX,RY is opened (non-latent)
// CloseRoom_RX_RY()            - called by HandlerRoomClose when room RX,RY is closed (non-latent)
// OutRoom_RX_RY()                - called by HandlerRoomOut when player wants to exit room RX,RY (can reposition player here) (non-latent)
//
// Objects interaction callbacks:
// PickupObject_ID()            - called when picking up item ID (latent)
// DropObject_ID()                - called when droping item ID (latent)
// ActionObject_ID()            - called when player hits ACTION key on object ID (latent)
// UseObject_ID( idx )            - called when player wants to use object idx (from inventory) over the ID object (from the map) (latent)
// CollideObject_ID_MODE()        - called when player collides with object ID in mode MODE (0=exit from collision, 1=just entered collision, 2=continuing to collide) (latent)
//
// Player callbacks:
// PlayerDeathMessage( death )     - called by PlayerLoseLife and sould just return the death message text. return "" for no death message box (latent)
// RespawnPlayer_DEATH()        - called by PlayerLoseLife for custom death respawns. DEATH is the value of player's P_DEATH property
//
// ID, RX, RY, MODE are to pe replaced with coresponding numbers
//
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Sets room names (non-latent)
// By default it loads them from the dizzy.nam file, using the RoomsLoadNames() function.
// You can also set the names for each room, by hand, with RoomSetName().
// Ex: RoomSetName( 1,1, "PRESS ACTION TO START" );
/////////////////////////////////////////////////////////////////////////////////
func RoomsSetNames()
{
    RoomsLoadNames(ROOM_NAMESFILE);
}

/////////////////////////////////////////////////////////////////////////////////
// Sets names to object items (non-latent)
// All items tht you might pick up and view in the inventory, must have names set.
// Use the ID you specified for the object in the map editor, to find the object.
// See ObjSetName() and ObjFind().
// Ex: ObjSetName(ObjFind(100),"BUCKET");
/////////////////////////////////////////////////////////////////////////////////
func ObjectsSetNames()
{
// Items
    ObjSetName( ObjFind(100), "TUFT OF GRASS" );
    ObjSetName( ObjFind(101), "TUFT OF GRASS" );
    ObjSetName( ObjFind(102), "A COIN" );
    ObjSetName( ObjFind(103), "A PIECE OF RAILING" );
    ObjSetName( ObjFind(104), "A PIECE OF RAILING" );
    ObjSetName( ObjFind(105), "A COIN" );
    ObjSetName( ObjFind(106), "HEAVY ROCK" );
    ObjSetName( ObjFind(107), "A KEY" );
    ObjSetName( ObjFind(108), "A STRONG CROWBAR" );
    ObjSetName( ObjFind(109), "A RUSTY OLD PICKAXE" );
    ObjSetName( ObjFind(110), "AN EMPTY BUCKET" );
    ObjSetName( ObjFind(111), "A BUCKET OF WATER" );
    ObjSetName( ObjFind(112), "A FRESH GREEN APPLE" );
    ObjSetName( ObjFind(113), "A COIN" );
    ObjSetName( ObjFind(114), "A DAGGER" );
    ObjSetName( ObjFind(115), "STRONG JACK" );
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int; rx; room x coordinate
// IN: int; ry; room y coordinate
// IN: int; idx; room custom text index (0-3)
// IN: ref; strref; string reference to the custom text
// Sets custom texts for each room (non-latent)
// There are 4 custom texts per room, that can be set from the map editor.
// They are saved by default in the ROOM_TEXTSFILE file (dizzy.rt)
// Each game receives these texts through this callback when the map is loaded
// and it can interpret them as it wants, for example to fill custom structures
// per each room, like ambient sounds, or any other things.
// Only non-empty strings are saved from the editor.
// This function uses string reference for speed.
/////////////////////////////////////////////////////////////////////////////////
func RoomSetCustomText( rx, ry, idx, refstr )
{
    // println("RCT: ",rx,",",ry,",",idx," = ",(*refstr));
    // ...
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int; death; cause of death
// Returns the player death message. Called by PlayerLoseLife().
// Declare more death defines in gamedef.gs (like DEATH_INFIRE, or DEATH_BATS)
// and set them to hurt and kill objects or just set them in the player's 
// P_DEATH property, then return specific messages in this callback, 
// for each cacuse of death .
/////////////////////////////////////////////////////////////////////////////////
func PlayerDeathMessage( death )
{
    if(death==-1)                    return "";
    // ...
    return "YOU HAVE DIED!";        // default
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int; file; file handler
// OUT: int; return 0 if something has failed, or 1 if operation was successful
// Saves additional user data.
// Users can save here the additional data (like global GS9 variables) they might need to place in the saved game file.
// Called from SaveGame(). See LoadUserData().
// Ex: if(!gs_filewriteint(g_myvariable,file)) return 0;
/////////////////////////////////////////////////////////////////////////////////
func SaveUserData( file )
{
    // ...
    return 1;
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int; file; file handler
// OUT: int; return 0 if something has failed, or 1 if operation was successful
// Load additional user data.
// Users can load here the additional data (like global GS9 variables) they saved before.
// They can also set various things, that depends on the just loaded data.
// For example, since the room's or object's names are not stored in the saved game, 
// if such a name is changed as the result of a solved puzzle, when the game is loaded, 
// it must be changed again, accordingly to the status of the puzzle.
// Called from LoadGame(). See SaveUserData(). 
// Ex: if(!gs_filereadint(&g_myvariable, file)) return 0;
/////////////////////////////////////////////////////////////////////////////////
func LoadUserData( file )
{
    // ...
    return 1;
}

/////////////////////////////////////////////////////////////////////////////////
// This function is called from MainMenu when a new game begins.
// Users must write here whatever they need their game to do, when it's started.
// For example here can be placed or called an intro sequence.
// In the end, the game must be unpaused, the player must be positioned where he must start, game music can be played, etc.
// In the Default Template this also opens a "Hello World!" message.
// Latent function.
/////////////////////////////////////////////////////////////////////////////////
func BeginNewGame()
{
    InventoryScroll();
    ClearKeys();
    GameSet(G_PAUSE,0);
    ObjSet(ObjFind(300),O_STATUS,1);
    PlayerSet(P_CREDITS,MAXCREDITS);
    PlayerSet(P_LIFE,100);
    PlayerSetPos(PLAYER_BEGINX,PLAYER_BEGINY);
    PlayerSet(P_DISABLE,0);
    MusicFade(0,0);
    MusicPlay(MUSIC_DEFAULT,0,1);
}

/////////////////////////////////////////////////////////////////////////////////
// Interactions
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////
// Move player up
/////////////////////////////
func CollideObject_99_1( idx )
{
    PlayerSet(P_Y,254);
}
func CollideObject_98_1( idx )
{
    y=PlayerGet(P_Y);
    y -= 4;
    PlayerSet(P_Y,y);
}
/////////////////////////////
// Switch
/////////////////////////////
func ActionObject_1()
{
    idx = ObjFind(1);
    if(ObjGet(idx,O_STATUS)==0)
    {
        idxswitch1 = ObjFind(1);
        flip = ObjGet(idxswitch1, O_FLIP);
        flip ^= 1;
        ObjSet(idxswitch1, O_FLIP, flip);
        Message0(5,7,"YOU FLICK THE SWITCH");
        MessagePop();
        BrushSet(BrushFind(2),B_DRAW,0);    // floor
        GameCommand(CMD_REFRESH);
        ObjSet(idx,O_STATUS,1);
    }
    else
    {
        Message0(5,7,"THE SWITCH IS STUCK");
        MessagePop();
    }
}
/////////////////////////////
// Teleport
/////////////////////////////
func CollideObject_301_1( idx )
{
    PlayerTransport();
    WaitFrames(10);
    PlayerSetPos(928,344);
    PlayerTransport();
    PlayerEnterIdle();
    WaitFrames(10);
}
/////////////////////////////
// Trapdoor
/////////////////////////////
func ActionObject_4()
{
    idx = InventoryScroll();
    if(idx <= -1) return;
    if(ObjGet(idx,O_ID)==108)
    {
        ObjSet(ObjFind(4),O_DISABLE,1);
        GameSet(INV_ITEM1, ObjFind(108) );
        BrushSet(BrushFind(3),B_DRAW,0);
        GameCommand(CMD_REFRESH);
    }
    else
    {
        DropObject( idx );
    }
}
/////////////////////////////
// Barrel
/////////////////////////////
func ActionObject_7()
{
   idx = InventoryScroll();
   if(idx<=-1 ) return;
   if(ObjGet(idx,O_ID)==108)
   {
    ObjSet(ObjFind(7),O_DISABLE,1);
    GameSet(INV_ITEM1, ObjFind(108) );
    ObjSet(ObjFind(109),O_DISABLE,0);
    GameCommand(CMD_REFRESH);
   }
      else
   {
        DropObject( idx );
   }
}
/////////////////////////////
// Rock
/////////////////////////////
func ActionObject_6()
{
   idx = InventoryScroll();
   if(idx<=-1 ) return;
   if(ObjGet(idx,O_ID)==109)
   {
    BrushSet(BrushFind(5),B_DRAW,0);
    ObjSet(ObjFind(6),O_STATUS,1);
    ObjSet(ObjFind(6),O_DISABLE,1);
    GameCommand(CMD_REFRESH);
   }
      else
   {
        DropObject( idx );
   }
}
/////////////////////////////
// Water
/////////////////////////////
func ActionObject_8()
{
   idx = InventoryScroll();
   if( idx <= -1 ) return;
   if(ObjGet(idx,O_ID)==110)
   {
    ObjSet(ObjFind(8),O_DISABLE,1);
    GameSet(INV_ITEM1, ObjFind(111) );
    GameCommand(CMD_REFRESH);
   }
      else
   {
        DropObject( idx );
   }
}
/////////////////////////////
// Fire
/////////////////////////////
func ActionObject_10()
{
   idx = InventoryScroll();
   if( idx <= -1 ) return;
   if(ObjGet(idx,O_ID)==111)
   {
    ObjSet(ObjFind(9),O_DISABLE,1);
    GameCommand(CMD_REFRESH);
   }
      else
   {
        DropObject( idx );
   }
}
/////////////////////////////
// Barrel 2
/////////////////////////////
func ActionObject_11()
{
    idx = InventoryScroll();
    if( idx <= -1 ) return;
    if(ObjGet(idx,O_ID)==108)
    {
        ObjSet(ObjFind(11),O_DISABLE,1);
        GameSet(INV_ITEM1, ObjFind(108) );
        ObjSet(ObjFind(102),O_DISABLE,0);
        GameCommand(CMD_REFRESH);
    }
    else
    {
        DropObject( idx );
    }
}
/////////////////////////////
// Talk to Pig
/////////////////////////////
func CollideObject_12_1( idx )
{
    objidx = ObjFind(12);
    if(ObjGet(objidx,O_STATUS)==0)
    {
        Message1(6,5,"\"HELLO, I'M DIZZY.\nWHO ARE YOU?\"");
        Message2(3,3,"\"I'M TOPS THE PIG,\nNICE TO MEET YOU.\"");
        Message1(4,4,"\"I'M A LITTLE LOST.\nCOULD YOU HELP ME\nOUT AT ALL?\"");
        Message2(3,4,"\"FOR SURE!\nONLY IF YOU CAN\nHELP ME.\"");
        Message1(5,5,"\"OK\"");
        Message2(5,3,"\"I'VE LOST MY KEY\nSOMEWHERE IN THE\nWOODS, I THINK.\nPLEASE BRING IT TO ME.\"");
        Message1(5,6,"\"I'LL BE BACK\nIN A MINUTE!\"");
        Message2(2,5,"\"WAIT!\nTAKE THIS CROWBAR,\nYOU MAY FIND IT USEFUL.\"");
        MessagePop();
        ObjSet(objidx,O_STATUS,1);
        ObjSet(ObjFind(108),O_DISABLE,0);
    }
}
/////////////////////////////
// Pig
/////////////////////////////
func ActionObject_12()
{
    objidx = ObjFind(12);
    if(ObjGet(objidx,O_STATUS)==1)
    {
        idx = InventoryScroll();
        if(idx <= -1) return;
        if(ObjGet(idx,O_ID)==107)
        {
            idxdoor1 = ObjFind(16);
            map = ObjGet(idxdoor1, O_MAP);
            map ^= 16;
            ObjSet(idxdoor1, O_MAP, map);
            Message2(5,5,"\"OH THANKS BUDDY!\nNOW I CAN GET IN.\"");
            Message1(3,6,"\"SO CAN YOU TELL ME\nHOW TO GET OUT\nOF THIS PLACE?\"");
            if(ObjGet(ObjFind(6),O_STATUS)==0)
            {
                Message2(4,3,"\"YES, BY GOING LEFT,\nBUT THERE IS A BIG\nROCK ON THE WAY.\"");
            }
            else
            {
                Message2(4,3,"\"YES, BY GOING LEFT,\nBUT THERE IS A BIG\nTROLL ON THE WAY.\"");
            }
            Message1(7,6,"\"THANKS.\"");
            MessagePop();
            ObjSet(ObjFind(12),O_DISABLE,1);
            ObjSet(ObjFind(113),O_DISABLE,0);
            ObjSet(ObjFind(108),O_DISABLE,0);
        }
        else
        {
            DropObject( idx );
            Message2(5,5,"\"I DON'T WANT THAT\"");
            MessagePop();
        }
    }
}
/////////////////////////////
// Troll
/////////////////////////////
func CollideObject_13_1( idx )
{
    objidx = ObjFind(13);
    if(ObjGet(objidx,O_STATUS)==0)
    {
        Message2(5,4,"\"YOU CAN'T PASS.\"");
        Message1(4,6,"\"WHY ARE YOU HERE,\nROCKWART?\"");
        Message2(1,5,"\"BECAUSE I'M A TROLL.\nTROLLS ARE SUPPOSED TO BE\nMEAN TO LITTLE EGGS.\"");
        MessagePop();
        ObjSet(objidx,O_STATUS,1);
        ObjSet(ObjFind(14),O_DISABLE,0);
    }
    if(ObjGet(objidx,O_STATUS)==1)
    {
        PlayerEnterJump(1,DIZ_POW+1);
    }
}
/////////////////////////////
// Apple & Coins
/////////////////////////////
func ActionObject_14()
{
    objidx = ObjFind(14);
    if(ObjGet(objidx,O_STATUS)==1)
    {
        if(PlayerGet(P_COINS)>=MAXCOINS)
        {
            money = PlayerGet(P_COINS)-MAXCOINS;
            PlayerSet(P_COINS,money);
            GameCommand(CMD_REFRESH);
            Message2(4,5,"\"WOW! TWENTY GOLD COINS.\nIMPRESSIVE!\nNOW YOU CAN PASS!\"");
            MessagePop();
            ObjSet(ObjFind(15),O_DISABLE,0);
            BrushSet(BrushFind(26),B_DRAW,0);
            ObjSet(ObjFind(13),O_STATUS,2);
            GameCommand(CMD_REFRESH);
        }
        else
        {
            idx = InventoryScroll();
            if(idx>-1) DropObject(idx);
        }
    }
    else
    {
        if(ObjGet(objidx,O_STATUS)==0) 
        {
            idx = InventoryScroll();
            if(idx <= -1 ) return;
            if(ObjGet(idx,O_ID)==112)
            {
                Message2(2,5,"\"AN APPLE FOR ME?\nTHAT'S VERY NICE,\nMR. EGG.\"");
                Message1(3,7,"\"SO... CAN I PASS NOW?\"");
                Message2(3,6,"\"OKAY. WHEN YOU\nPAY ME 20 DIAMONDS.\"");
                Message1(4,5,"\"DON'T YOU MEAN COINS?\"");
                Message2(2,7,"\"WHATEVER, ANYTHING\nSHINY IS GOOD.\"");
                MessagePop();
                ObjSet(objidx,O_STATUS,1);
            }
            else
            {
                DropObject(idx);
            }
        }
    }
}
/////////////////////////////
// Crusher Trigger
/////////////////////////////
func CollideObject_20_1( idx )
{
    PlayerSet(P_LAYER,-1);
    PlayerSet(P_LIFE,0);
    PlayerSet(P_DEATH,DANGER_CRUSHER);
    ObjSet(ObjFind(19),O_DISABLE,0);
    ObjSet(ObjFind(20),B_DRAW,3);
    ObjSet(ObjFind(21),B_DRAW,3);
    ObjSet(ObjFind(23),B_DRAW,3);
    ObjSet(ObjFind(24),B_DRAW,3);
    ObjSet(ObjFind(22),O_DISABLE,1);
}
/////////////////////////////
// Tree Trunk
/////////////////////////////
func ActionObject_17()
{
    idx = InventoryScroll();
    if( idx <= -1 ) return;
    if(ObjGet(idx,O_ID)==114)
    {
        ObjSet(ObjFind(17),O_DISABLE,1);
        ObjSet(ObjFind(105),O_DISABLE,0);
        GameCommand(CMD_REFRESH);
    }
    else
    {
        DropObject( idx );
    }
}
/////////////////////////////
// Stop Crusher
/////////////////////////////
func ActionObject_117()
{
    idx = InventoryScroll();
    if( idx <= -1 ) return;
    if(ObjGet(idx,O_ID)==115)
    {
        ObjSet(ObjFind(20),O_DISABLE,1);
        ObjSet(ObjFind(25),O_DISABLE,0);
        Message0(5,6,"THE EXTENDED JACK\nPREVENTS THE CRUSHER\nFROM DESCENDING!");
        MessagePop();
        GameCommand(CMD_REFRESH);
    }
    else
    {
        DropObject( idx );
    }
}
/////////////////////////////
// The End
/////////////////////////////
func CollideObject_15_1( idx )
{
    Message0(5,6,"CONGRATULATIONS!\nYOU'VE LEFT\nTHE LOST WOODS!");
    MessagePop();
    GameCommand(CMD_START);
}
/////////////////////////////
// You can't drop items here
/////////////////////////////
func ActionObject_99()
{
}

func UpdateRoom_1_2() // SPIDER
{
     AIUpdateTrain(ObjFind(201));
     AIUpdateChainLink(ObjFind(200));
}
func UpdateRoom_2_4() // SPIDER
{
     AIUpdateTrain(ObjFind(205));
     AIUpdateChainLink(ObjFind(204));
}
func UpdateRoom_5_3() // SPIDER
{
     AIUpdateTrain(ObjFind(209));
     AIUpdateChainLink(ObjFind(208));
}
func UpdateRoom_3_4() // SPIDER
{
     AIUpdateTrain(ObjFind(212));
}
func UpdateRoom_4_5() // TELEPORT
{
   idx = ObjFind(300);
   y = ObjGet(idx,O_Y);
   if(ObjGet(idx,O_STATUS)==2)
   {
     y -= 1;
     if(y<=728)
     {
       y=728;
       ObjSet(idx,O_STATUS,1);
     }
   }
   else
   {
     y += 1;
     if(y>=751)
     {
       y=751;
       ObjSet(idx,O_STATUS,2);

     }
   }
   c = ObjGet(idx,O_C);
   c += 1;

   if ( c == 8 ) { c = 0; }

   if ( c == 0 ) { ObjSet(idx,O_COLOR,COLOR_BLACK);   }
   else
   if ( c == 1 ) { ObjSet(idx,O_COLOR,COLOR_BLUE);    }
   else
   if ( c == 2 ) { ObjSet(idx,O_COLOR,COLOR_RED);     }
   else
   if ( c == 3 ) { ObjSet(idx,O_COLOR,COLOR_MAGENTA); }
   else
   if ( c == 4 ) { ObjSet(idx,O_COLOR,COLOR_GREEN);   }
   else
   if ( c == 5 ) { ObjSet(idx,O_COLOR,COLOR_CYAN);    }
   else
   if ( c == 6 ) { ObjSet(idx,O_COLOR,COLOR_YELLOW);   }
   else
   if ( c == 7 ) { ObjSet(idx,O_COLOR,COLOR_WHITE);   }

   ObjSet(idx,O_C,c);
   ObjSet(idx,O_Y,y);
}

/////////////////////////////////////////////////////////////////////////////////
