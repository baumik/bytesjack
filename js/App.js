$(document).ready(function(){
    new App();
});

var App = function()
{
    AppClass = this;
    
    var types           = ['Clubs', 'Diamonds', 'Hearts', 'Spades'],
        cards           = [],
        cardsIndex      = 0,
        isPlaying       = false,
        dealNav         = $('#deal'),
        actionsNav      = $('#actions'),
        pCardsContainer = $('#player-cards'),
        dCardsContainer = $('#dealer-cards'),
        playerTotal     = $('#player-total'),
        playerCards     = [],
        playerAces      = 0,
        dealerTotal     = $('#dealer-total'),
        dealerCards     = [],
        dealerAces      = 0;
        
  
//  Initialisation
    this.init = function()
    {
        $('a[href="#"]').bind('click', function(e){ e.preventDefault(); });
        initDeck();
    };
    
// Cards management
    var initDeck = function()
    {
        for ( var i = 0; i < types.length; i++ ) {
          for ( var j = 1; j <= 13; j++ ) {
            var value = ( j > 10 ) ? 10 : j;
            cards.push({ card:j, value: value, type: types[i] });
          };
        }
        
        cards.shuffle();
    };
    
//  Game management
    var deal = function()
    {
        if ( isPlaying ) return;
        isPlaying = true;
        
        ditributeCards();
    };
    
    var hit = function() {
        addCard('front', 'player');
        if ( playerCards.sum() > 21 ) lose('busted');
    };
    
    var stand = function()
    {
        revealDealerCard();
        if ( dealerCards.sum() < 17 ) dealerTurn();
        else end();
    };
    
      var dealerTurn = function()
      {
          addCard('front', 'dealer');
          dealerTotal.html(calculateDealerScore());
          
          if ( dealerCards.sum() < 17 ) dealerTurn();
          else end();
      };
    
    var doubledown = function()
    {
        console.log('double');
    };
    
    var push = function()
    {
        console.log('push');
        stopGame();
    };
    
    var win = function ( msg )
    {
        console.log('win', msg);
        stopGame();
    };
    
    var lose = function ( msg )
    {
        console.log('lose', msg);
        stopGame();
    };
    
    var end = function()
    {
        var pScore  = playerCards.sum(),
            dScore  = dealerCards.sum();
        
        if ( dScore > 21 ) win('dealer busted');
        else if ( dScore > pScore ) lose('');
        else if ( pScore > dScore ) win('');
        else if ( pScore == dScore ) push();
    };
    
    var stopGame = function()
    {
        dealNav.show();
        actionsNav.hide();
    };
    
    var ditributeCards = function()
    {
        addCard('front', 'player');
        addCard('front', 'dealer');
        addCard('front', 'player');
        addCard('back', 'dealer');
        
        dealNav.hide();
        actionsNav.show();
        
        checkBlackjack();
    };
    
    var checkBlackjack = function()
    {
        var pScore  = playerCards.sum(),
            dScore  = dealerCards.sum();
        
        if ( pScore == 21 && dScore == 21 ) push();
        else if ( pScore == 21 ) win('blackjack');
        else if ( dScore == 21 ) {
          lose('blackjack');
          revealDealerCard();
        }
    };
    
    var addCard = function ( side, player )
    {
        var cardData  = cards[cardsIndex],
            container = ( player == 'player' ) ? pCardsContainer : dCardsContainer;
            card      = ( side == 'front' )
                        ? $('<div data-id="'+cardsIndex+'" class="card">'+cardData.card+' '+cardData.type+'</div>')
                        : $('<div data-id="'+cardsIndex+'" class="card back">Back</div>');
        
        cardsIndex++;
        if ( player == 'player' ) addToPlayerTotal(cardData.value);
        else                      addToDealerTotal(cardData.value);
        
        container.append(card);
    };
    
//  Player management
    var addToPlayerTotal = function ( value )
    {
        if ( value == 1 ) {
          value = 11;
          playerAces++;
        }
        
        playerCards.push(value);
        playerTotal.html(calculatePlayerScore());
    };
    
    var calculatePlayerScore = function()
    {
        var score = playerCards.sum();
        
        if ( score > 21 && playerAces > 0 ) {
          playerCards.splice(playerCards.indexOf(11), 1, 1);
          playerAces--;
          score = calculatePlayerScore();
        }
        
        return score;
    };
    
//  Dealer management
    var revealDealerCard = function()
    {
        var card  = $('.back'),
            id    = card.data('id'),
            data  = cards[id];
        
        card.html(data.card + ' ' + data.type);
        dealerTotal.html(calculateDealerScore());
    };
    
    var addToDealerTotal = function ( value )
    {
        if ( value == 1 ) {
          value = 11;
          dealerAces++;
        }
        
        dealerCards.push(value);
    };
    
    var calculateDealerScore = function()
    {
        var score = dealerCards.sum();
        
        if ( score > 21 && dealerAces > 0 ) {
          dealerCards.splice(dealerCards.indexOf(11), 1, 1);
          dealerAces--;
          score = calculateDealerScore();
        }
        
        return score;
    };
    
//  Public access
    this.deal       = function() { deal(); };
    this.hit        = function() { hit(); };
    this.stand      = function() { stand(); };
    this.doubledown = function() { doubledown(); };
  
//  Constructor
    (function() {
      AppClass.init();
    })();
};

/* 
 * Array shuffle <http://snipplr.com/view/535>
 * Array sum <http://snipplr.com/view/533>
*/
Array.prototype.shuffle = function() { for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x); }
Array.prototype.sum = function() { for(var s = 0, i = this.length; i; s += this[--i]); return s; };