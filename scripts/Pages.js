var loadLink = "";

var menuEffects = new Class({
	initialize: function(selector, options) {
		this.options = Object.extend({
			subElement: false,
			subElementSelector: 'a',
			slideIn: false,
			slideInDelayed: false,
			slideInDelay: 150,
			slideInProperty: 'margin-top',
			slideInRange: ['-30', '0']
		}, options || {})
		this.selector = selector;
		this.currTimer = 500;
		if (this.options.slideIn)
		{
			$A($E(selector).childNodes).each(function(el){
				if ($type(el) == 'element')
				{
					el = $(el);
					if (this.options.subElement)
						el = el.getElement(this.options.subElementSelector);
					this.slideIn(el);
					this.addSpecialEffects(el);
				}
			}, this);
		}
		if (this.options.slideOut)
		{
			$ES('a').each(function (element) {
				if (!(element.hasClass('QE_Link') | element.hasClass('download')))
				{
					element.onclick = function() {
						loadLink = function ()
						{
							document.location = this.href;
						}
						mainContentEffect = new Fx.Style($E('.navigation ul'), 'opacity', {
						duration: 300,
						onComplete: loadLink.bind(this)
						});
						mainContentEffect.custom(1, 0);
						return false;
					};
				}
			});
		}
		$ES(selector + ' li ul').each(function(el) {
			el.setStyles({
				'display': 'block',
				'opacity': 0
			});
			elParent = $(el.parentNode);
			
			currentMenu = new Fx.Style(el, 'opacity');
			elParent.addEvents({
				'mouseover': function(submenu, myParent) {
					myParent.addClass('hover');
					submenu.clearTimer();
					submenu.custom(1);
				}.pass([currentMenu, elParent]),
				'mouseout': function(submenu, myParent) {
					myParent.removeClass('hover');
					submenu.clearTimer();
					submenu.custom(0);
				}.pass([currentMenu, elParent])
			})
			
		}.bind(this));
	},
	slideIn: function(el)
	{
		$(el).setStyle(this.options.slideInProperty, this.options.slideInRange[0] + "px");
		//el.setStyle('zIndex', 1);
		var effect = el.effect(this.options.slideInProperty, {transition: Fx.Transitions.elasticOut, duration: 1000});
		if (this.options.slideInDelayed)
		{
			effect.custom.delay(this.currTimer, effect, this.options.slideInRange);
			this.currTimer += this.options.slideInDelay;
		} else
		effect.custom.delay(this.options.slideInDelay, effect, this.options.slideInRange);
	},
	slideOut: function(el)
	{
		var effect = el.effect(this.options.slideOutProperty, {transition: Fx.Transitions.elasticOut, duration: 1000});
		window.addEvent('beforeunload', function (effect) {
			effect.custom.pass(this.options.slideInRange, effect);
			}.pass(effect, this)
		);
	},
	addSpecialEffects: function(el)
	{
		if (!$(el.parentNode).hasClass('active'))
		{
			el.setStyles({
				'borderTopWidth': '0px',
				'borderTopColor': '#000',
				'borderTopStyle': 'solid'
			});
			currentItem = new Fx.Style(el, 'borderTopWidth', {transition: Fx.Transitions.backOut, duration: 800});
			$(el.parentNode).addEvents({
				'mouseover': function(itemBorder) {
					itemBorder.clearTimer();
					itemBorder.custom(5);
				}.pass(currentItem),
				'mouseout': function(itemBorder) {
					itemBorder.clearTimer();
					itemBorder.custom(0);
				}.pass(currentItem)
			})
		}
	}
});
function processMenuEffects (){
	var myMenus = new menuEffects('.navigation ul', {
		slideIn: true,
		slideInDelayed: true,
		slideOut: true,
		subElement: true
	});
}
window.onDomReady(processMenuEffects);

