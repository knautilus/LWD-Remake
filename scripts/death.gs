/////////////////////////////////////////////////////////////////////////////////
// death types.gs
// included by game.gs
// User writes here functions that deal with ways the play can die
//
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// CUSTOM MESSAGES
// put all #def's in the def.gs file
/////////////////////////////////////////////////////////////////////////////////
func DeathText()
{
   idx=PlayerGet(P_DEATH);

   text="";
   if(idx==DANGER_DEFAULT)   { text += "";  }
   else
   if(idx==DANGER_WATER)  { text += "{c:0xff00ffff}YOU FELL IN THE\nWATER AND DROWNED\n\n"; }
   else
   if(idx==DANGER_FIRE)      { text += "{c:0xff00ffff}YOU WERE BURNT\nBY THE FLAMES\n\n"; }
   else
   if(idx==DANGER_SPIKES)      { text += "{c:0xff00ffff}YOU WERE SKEWERED BY\nTHE SPIKES!\n\n"; }
   else
   if(idx==DANGER_CRUSHER)     { text += "{c:0xff00ffff}YOU WERE SQUEEZED BY\nTHE CRUSHER!\n\n"; }
   else
   if(idx==DANGER_BAT)       { text += "{c:0xff00ffff}YOU WERE KILLED BY\nA BAT!\n\n"; }
   else
   if(idx==DANGER_BIRD)     { text += "{c:0xff00ffff}YOU WERE KILLED BY\nA BIRD!\n\n"; }
   else
   if(idx==DANGER_SPIDER)     { text += "{c:0xff00ffff}YOU WERE KILLED BY\nA SPIDER!\n\n"; }
   else
   if(idx==DANGER_FISH)      { text += "{c:0xff00ffff}YOU WERE KILLED BY\nA FISH!\n\n"; }
   else
   if(idx==DANGER_GHOST)    { text += "{c:0xff00ffff}YOU WERE KILLED BY\nA GHOST!\n\n"; }
   else
   if(idx==DANGER_LAVA)      { text += "{c:0xff00ffff}YOU FELL IN THE\nLAVA AND WERE BURNT\n\n"; }
   else
   if(idx==DANGER_RAIN)      { text += "{c:0xff00ffff}YOU WERE KILLED BY\nTHE RAIN!\n\n"; }
   else
   if(idx==DANGER_ACIDRAIN)      { text += "{c:0xff00ffff}YOU WERE KILLED BY\nTHE ACID RAIN!\n\n"; }
   else
   if(idx==DANGER_VAMPIRE)      { text += "{c:0xff00ffff}YOU WERE KILLED BY\nTHE VAMPIRE!\n\n"; }
   else
   if(idx==DANGER_DRAGON)      { text += "{c:0xff00ffff}YOU WERE BURNT\nBY THE DRAGON!\n\n"; }
   else
   if(idx==DANGER_SWAMP)      { text += "{c:0xff00ffff}YOU FELL INTO THE\nSWAMP AND DROWNED!\n\n";}
   else
   if(idx==DANGER_MAGICBOLT)      { text += "{c:0xff00ffff}YOU WERE KILLED BY\nZAKS MAGIC LIGHTENING!\n\n";}
   else
   if(idx==DANGER_OCEAN)      { text += "{c:0xff00ffff}YOU WERE IN THE WATER\nTOO LONG AND DROWNED!\n\n"; }
   else
   if(idx==DANGER_FALL)      { text += "{c:0xff00ffff}YOU HIT THE GROUND\nTOO HARD!\n\n"; }
   else
   if(idx==DANGER_EAGLE)      { text += "{c:0xff00ffff}YOU WERE KILLED BY\nTHE EAGLE!\n\n"; }
   else
   if(idx==DANGER_MAGICWALL)      { text += "{c:0xff00ffff}YOU WERE KILLED BY\nTHE MAGIC WALL!\n\n"; }


   text += "{f:1}GAME OVER!{f:0}";

   GamePause(1);
   DialogPush();
   DialogSetText(text);
   DialogSetColor(0xffffff00);
   DialogFitCenter();
   DialogRun();
   DialogPop();
   GamePause(0);
}

