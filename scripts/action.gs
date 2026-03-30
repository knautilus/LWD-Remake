/////////////////////////////////////////////////////////////////////////////////
// action.gs
// Respond to the action event and implement basic action flow
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// This is the main latent action function requested by the action handler.
// First it tries "pickup" on a pickable object, if found.
// If not, it tries "action" on an action object, if found.
// If not, it opens the inventory and let you use/drop an item.
/////////////////////////////////////////////////////////////////////////////////
func Action()
{
    // ignore the action key being pressed if the inventory is scrolling
    if(GameGet(INV_DROPPEDFRAME)==1) return;
    
    idx = FindPickupObject();
    if(idx!=-1)
    {
        PickupObject(idx);
        return;
    }
    idx = FindActionObject();
    if(idx!=-1)
    {
        ActionObject(idx);
        return;
    }
    idx = InventoryScroll();
    if(idx!=-1)
    {
        UseObject(idx);
    }
}

/////////////////////////////////////////////////////////////////////////////////
// OUT: int(object index/-1)
// Finds the first pickable object that you're touching.
/////////////////////////////////////////////////////////////////////////////////
func FindPickupObject()
{
    pcount = ObjPresentCount();
    for(pidx=pcount-1;pidx>=0;pidx--) // iterate present objects
    {
        idx = ObjPresentIdx(pidx); // object index
        if( ObjGet(idx,O_DISABLE) ) continue;
        if( ObjIsPickup(idx) )
            if( PlayerTouchObject(idx) ) // touched objects only
                return idx;
    }
    return -1;
}

/////////////////////////////////////////////////////////////////////////////////
// OUT: int(object index/-1)
// Finds the first action object that you're touching.
/////////////////////////////////////////////////////////////////////////////////
func FindActionObject()
{
    pcount = ObjPresentCount();
    for(pidx=pcount-1;pidx>=0;pidx--) // iterate present objects
    {
        idx = ObjPresentIdx(pidx); // object index
        if( ObjGet(idx,O_DISABLE) ) continue;
        if( ObjIsAction(idx) )
            if( PlayerTouchObject(idx) ) // touched objects only
                return idx;
    }
    return -1;
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int(object index)
// Pickup an object considering the object class (item, coin, food, life).
// If available calls private pickup function "PickupObject_ID" insteed.
/////////////////////////////////////////////////////////////////////////////////
func PickupObject( idx )
{
    println( "pickup idx " + (str)idx );
    // try private function
    id = ObjGet(idx, O_ID);
    fid = gs_fid("PickupObject_"+(str)id);
    if(fid!=-1)
    {
        call(fid);
        return;
    }

    class = ObjGet(idx, O_CLASS);

    if(class==CLASS_ITEM) // items are to be picked up in the inventory
    {
        idx2 = InventoryScroll (idx);
        ObjSet(idx, O_DISABLE, 1); // make disabled (picked up).
        if(idx2!=-1) UseObject(idx2);
    }
    else if(class==CLASS_COIN) // coins are to be collected
    {
        coins = PlayerGet(P_COINS)+1;
        ObjSet(idx, O_DISABLE, 1); // make disabled (picked up)
        PlayerSet(P_COINS,coins);
        SamplePlay(FX_COIN);
    }
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int(object index)
// Use an object from the inventory.
// If an action object (ID) that accepts items is found, "UseObject_ID" is called.
// If not, the item is simply dropped
/////////////////////////////////////////////////////////////////////////////////
func UseObject( idx )
{
    // find action object with UseObject_ID function
    idx2 = FindActionObject();
    if(idx2!=-1)
    {
        id = ObjGet(idx2, O_ID);
        sz = "UseObject_"+(str)id;
        fid = gs_fid(sz);
        if(fid!=-1)
        {
            call(idx, fid); // sent item idx as parameter
            return;
        }
    }

    // just drop it
    DropObject(idx);
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int(object index)
// Drops an object from the inventory.
// The object is placed on the player's current position.
// If available calls private drop function "DropObject_ID" insteed.
// Do not call it back from inside such a private function!
/////////////////////////////////////////////////////////////////////////////////
func DropObject( idx )
{
    //if(!IsPlayerSafe() || !IsPlayerStable()) return; // don't drop if not safe
    
    // try private function
    id = ObjGet(idx, O_ID);
    fid = gs_fid("DropObject_"+(str)id);
    if(fid!=-1)
    {
        call(fid);
        return;
    }

    DropDownObj(idx);
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int(object index)
// Just place the object on the player's current position,
// without calling any private function, so it may be used inside those
/////////////////////////////////////////////////////////////////////////////////
func DropDownObj( idx )
{
    //InventorySub(idx);
    ObjSet(idx,O_DISABLE,0);
    ObjSet(idx,O_X, PlayerGet(P_X)-ObjGet(idx,O_W)/2);
    ObjSet(idx,O_Y, PlayerGet(P_Y)+PlayerGet(P_H)/2-ObjGet(idx,O_H));
    ObjPresent(idx); // force it to be present in current room (v1.2)
}

/////////////////////////////////////////////////////////////////////////////////
// IN: int(object index)
// Action on an object.
// If available, calls private action function "ActionObject_ID".
// If not, opens inventory and allows use /drop
/////////////////////////////////////////////////////////////////////////////////
func ActionObject( idx )
{
    // try private function
    id = ObjGet(idx, O_ID);
    sz = "ActionObject_"+(str)id;
    fid = gs_fid(sz);
    if(fid!=-1)
    {
        call(fid);
        return;
    }

    // open inventory to use/drop something
    idx2 = InventoryScroll();
    if(idx2!=-1) UseObject(idx2);
}

/////////////////////////////////////////////////////////////////////////////////
// IN: idxin (Object Index: To be added to the inventory)
// Scrolls items through the inventory
/////////////////////////////////////////////////////////////////////////////////
func InventoryScroll( idxin )
{
    // Refuse pickup if pickup is scrolling
    if(GameGet(INV_DROPPEDFRAME)==1) return;
    
    // Get the object index, of the item being picked up if available, if not set to nothing ( -1 )
    if(!?idxin) idxin = -1;

    idx = GameGet(INV_ITEM1);
    GameSet(INV_DROPPED, (GameGet(INV_ITEM1)));
    GameSet(INV_ITEM1, idxin );
    if(idx==-1)
    {
        SamplePlay(FX_BEEP1);
    }
    else if(idxin!=-1)
    {
        SamplePlay(FX_COIN);
    }
    else
    {
        SamplePlay(FX_COIN);
    }

    GameSet(INV_DROPPEDFRAME, 1);

    // Return the object index of a dropped item
    return idx;
}