/* 
 Tolomeo is a developing framework for visualization, editing,  
 geoprocessing and decisional support application based on cartography.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 This file is part of Tolomeo.
 
 Tolomeo is free software; you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License 
 as published by the Free Software Foundation; either version 3 of the License, 
 or (at your option) any later version.
 
 Tolomeo is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 
 You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo � un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo � un software libero; � possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo � distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo � sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

/**
 * Class: TolomeoExt.ToloPanelIntra
 * Layout per applicazioni intranet: toolbar nord, mappa center, pannello est (accordion ricerche e legenda) e pannello gestionale ovest.
 * 
 * Inherits from:
 *  - <TolomeoExt.ToloPanelBase>
 * 
 * Author: 
 * Mattia Gennari
 *
 */

Ext.define('TolomeoExt.ToloPanelIntra', {

	extend: 'TolomeoExt.ToloPanelBase',
	alias:  'tx_ToloPanelIntra',
	
	/** 
	 * Property: withDataPanel
	 * {Boolean} Indica se � presente o meno il data panel (iframe pannello).
	 * 
	 */
	withDataPanel: true,

	/** 
	 * Property: withToolsPanel
	 * {Boolean} Indica se � presente o meno il tools panel (pannello strumenti).
	 * 
	 */
	withToolsPanel: true,
	
	/** 
	 * Property: collapsedToolsPanel
	 * {Boolean} 
	 * 
	 */
	collapsedToolsPanel: false,
	
	/** 
	 * Property: collapsedDataPanel
	 * {Boolean} 
	 * 
	 */
	collapsedDataPanel: true,
	
	/** 
	 * Property: withLegendaPanel
	 * {Boolean} Indica se � presente o meno la legenda.
	 * 
	 */
	withLegendaPanel: true,
	
	/** 
	 * @cfg {Boolean} withStylePanel
	 * Indica se � presente o meno la finestra di gestione stili
	 * 
	 */
	withStylePanel: true,
	
	/** 
	 * Property: withQueryPanel
	 * {Boolean} 
	 * 
	 */
	withQueryPanel : true,
	
	/** 
	 * Property: withCodelessPanel
	 * {Boolean} 
	 * 
	 */
	withCodelessPanel : false,

	/**
	 * Tipo di tools panel. Supportati accordion (default) e tabpanel 
	 * @type String 
	 */
	toolsPanelType: null,
	
	/**
	 * Posizione del toolspanel. consentiti 'west', 'east' (default), 'north', 'south'
	 * @type String 
	 */
	toolsPanelPosition: null,
	
	/**
	 * Tipo di tools panel. Supportati panel (default), window, intoolspanel
	 * @type String 
	 */
	dataPanelType: null,
	
	/**
	 * 
	 * @type 
	 */
	activePanel: null,
	
	/**
	 * Permette di impostare pannelli aggiuntivi. Esempio di utilizzo <br/>
	extraPanels: { position: 'first',   	// valori consentiti first, last  
				   panels: [{				// In questo array pu� essere inserito qualsiasi oggetto grafico extjs (pannelli, tabpanel etc)
								text: "Pannello di prova",
								title: "titolo1",
								iconCls: 'iconToc',
								html: "<b>contenuto</b>"
							},{
								text: "Pannello di prova",
								title: "titolo2",
								iconCls: 'iconToc',
								html: "<b>contenuto</b>"
							}]},
	*/
	extraPanels: null,
	
	
	/** 
	 * Method: initComponent
	 * 
	 */
	initComponent: function(){

		this.mapPanelOpt = {};
		this.layout = 'border';
		
		if (this.toolbarOpt==null) {
			this.toolbarOpt = {};
		}
		
		if (this.withToolsPanel) {
			if (this.withLegendaPanel && this.legendaPanelOpt==null) this.legendaPanelOpt = {};
			if (this.withQueryPanel   && this.ricercaPanelOpt==null) this.ricercaPanelOpt = {};
			if(this.withCodelessPanel){
				this.formCodelessPanelOpt = this.formCodelessPanelOpt || {};
			}
		}
		
		if (this.withStylePanel) {
			if (this.stylePanelOpt==null) this.stylePanelOpt={};
		}
		
		this.callParent(arguments);
		
		this.collapsedDataPanel = (this.collapsedDataPanel && this.paramsJS.azioniApertura.pannelloChiuso);
		
		// Pannello strumenti in cui inserisco Ricerche e Legenda
		if (this.withToolsPanel) {
			var items = [];
			
			if(this.withCodelessPanel){
				items.push(this.codeLessPanel);
			}

			if(this.withLegendaPanel){
				items.push(this.ricercaPanel);
				items.push(this.legendaPanel);
			}else{
				items.push(this.ricercaPanel);
			}
			
			if (this.extraPanels) {
				var p = this.extraPanels.position ? this.extraPanels.position.toLowerCase() : null;
				if (p==null || p=='first') this.extraPanels.panels.reverse();	
				for (var i=0; i<this.extraPanels.panels.length; i++) {
					if (this.extraPanels.position) {
						
						if (p=="first") {
							items.unshift(this.extraPanels.panels[i]);	
						} else {
							if (p=="last") {
								items.push(this.extraPanels.panels[i]);	
							} else {
								items.unshift(this.extraPanels.panels[i]);		
							}	
						}
					} else {
						items.unshift(this.extraPanels.panels[i]);
					}
				}
			}
			
			var reg = this.toolsPanelPosition ? this.toolsPanelPosition : 'east';
			if (this.toolsPanelType=='tabpanel') {
				
				this.toolsPanelOpt = this.toolsPanelOpt || {}; 
				
				TolomeoExt.applyIfEmpty(this.toolsPanelOpt, {
					title: 'Strumenti',
					width: 270,
					minWidth: 270,
					maxWidth: 500,
					split: true,
					collapsible: true
				});
				
				Ext.apply(this.toolsPanelOpt, {
					region: reg,
					activeTab: this.activePanel ? this.activePanel : undefined,
					collapsed: this.collapsedToolsPanel,
					layoutConfig:{
			            animate: true
			        },
					items: items
				});
				
				this.toolsPanel = Ext.create('Ext.tab.Panel', this.toolsPanelOpt);
			} else {
				
				if (this.activePanel) {
					for (var i=0; i<items.length; i++) {
						items[i].collapsed = (i==this.activePanel) ? false : true;	
					}
				}
				
				this.toolsPanelOpt = this.toolsPanelOpt || {}; 
				
				TolomeoExt.applyIfEmpty(this.toolsPanelOpt, {
					title: 'Strumenti',
					width: 270,
					minWidth: 270,
					maxWidth: 500,
					split: true,
					collapsible: true
				});
				
				Ext.apply(this.toolsPanelOpt, {
					region:reg,
					layout:'accordion',
					animCollapse: false,    // NB. Deve essere false per evitare ricaricamento iframe
					collapsed: this.collapsedToolsPanel,
					layoutConfig:{
			            animate: true
			        },
					items: items
				});
				
				this.toolsPanel = Ext.create('Ext.Panel', this.toolsPanelOpt);
			}
			this.add(this.toolsPanel);
		}
			
		// Pannello applicazione
		if (this.withDataPanel==true) {			 
			var mapPanel = this.mapPanel;
			var frameName = 'pannello';
			var iframe = Ext.create('TolomeoExt.ToloIFrame', {
					frameName: frameName,
					url: ''
				});
			
			if (this.dataPanelType=="window") {
				// FINESTRA FLOTTANTE
				this.dataPanel = Ext.create('Ext.Window', {
											title: "Informazioni",
											layout: 'fit',
											height: 400,
											width: 500,
										//	style : 'background: rgba(0, 0, 0, 0.5);',
										//	bodyStyle : 'opacity: 0.2',
										//	resizeHandles: 'e w ',
										/*	tools:[{
											    type:'refresh',
											    tooltip: 'Refresh form Data',
											    // hidden:true,
											    handler: function(event, toolEl, panelHeader) {
											        // refresh logic
											    }
											},
											{
											    type:'help',
											    tooltip: 'Get Help',
											    callback: function(panel, tool, event) {
											        // show help here
											    }
											}],*/
											maximizable: true,
											minimizable: true,
											closeAction: 'hide',
											cls: 'clearCSS', 
											tbar: ['->',{
												text: 'Stampa',
												iconCls: 'iconPrint',
												tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
									            handler: function(){
									            	top.frames[frameName].focus();
													top.frames[frameName].print();
												}, scope: this
											}],
											items: [iframe]}); 
				
			} else {
				if (this.dataPanelType=="intoolspanel") {
					this.dataPanel = Ext.create('Ext.Panel', {
											title: "Informazioni",
											layout: 'fit',
											//height: 400,
											//width: 500,
											//maximizable: true,
											//minimizable: true,
											//closeAction: 'hide',
											tbar: ['->',{
												text: 'Stampa',
												iconCls: 'iconPrint',
												tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
									            handler: function(){
									            	top.frames[frameName].focus();
													top.frames[frameName].print();
												}, scope: this
											}],
											items: [iframe]}); 
					this.toolsPanel.add(this.dataPanel);
				} else {
					// dataPanelType non definito default a westPanel	
					this.dataPanel = Ext.create('Ext.Panel', {
						//id: 'dataPanel', //id necessario per fare l'expnad del pannello laterale
						title: 'Gestione',
						region: 'west',
						layout: 'fit',
						split: true,
						collapsible: true,
						animCollapse: false,    // NB. Deve essere false per evitare ricaricamento iframe
						collapsed: this.collapsedDataPanel,
						width: 350,
						minWidth: 350,
						iconCls: 'iconPannello',
						floatable : false,	// NB. Deve essere false per evitare ricaricamento iframe
						maximize : function(){
							//var region = this.ownerCt.layout[this.region];
							if(!this.maximized){
				            	this.oldSize = this.getSize();
							}
				            var newWidth = this.getSize().width + mapPanel.getSize().width;
				            this.setWidth(newWidth);
				            this.tools['maximize'].setVisible(false);
				            this.tools['restore'].setVisible(true);
				            this.maximized = true;
						},
						
						restore : function(){
							this.setWidth(this.oldSize.width);
				            this.tools['maximize'].setVisible(true);
				            this.tools['restore'].setVisible(false);
				            this.maximized = false;
						},
						
						tools: [{
							id: 'restore',
							qtip: 'Riduci pannello',
							hidden:true,
							visible: false,
							callback: function(panel, tool, event) {
								panel.restore();
							}
						},{
							id: 'maximize',
							qtip: 'Espandi pannello',			
						
							callback: function(panel, tool, event) {
								panel.maximize();				
							}									
						}],
			
						tbar: ['->',{
							text: 'Stampa',
							iconCls: 'iconPrint',
							tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
				            handler: function(){
				            	top.frames[frameName].focus();
								top.frames[frameName].print();
							}, scope: this
						}],
						items: [iframe]
					});
				
					if(this.withToolsPanel){
						this.toolsPanel.on('beforeexpand',
							function(){
								if(this.dataPanel.maximized){
									this.dataPanel.restore();
									this.mapPanel.syncSize();
									this.toolsPanel.on('expand',function(){this.dataPanel.maximize();this.mapPanel.syncSize();},this,{single:true});
								}
							},this);
		
						this.toolsPanel.on('collapse',function(){if(this.maximized)this.maximize();},this.dataPanel);
					}
					
					this.on('resize',
								function(){if(this.dataPanel.maximized){this.restoreDataPanel();this.maximizeDataPanel();}else{this.restoreDataPanel();}},
								this);
					
					this.add(this.dataPanel);
				}
			}
			
		}
		
		this.add(this.mapPanel);
	},

	beforeOpenUrl: function(url, target) {
		
		if (target=='pannello' && url!='about:blank') {
			if (this.dataPanelType=="window") {
				// FINESTRA FLOTTANTE
				this.dataPanel.show();
			} else if (this.dataPanelType=="intoolspanel") {
				if (this.toolsPanelType=='tabpanel') {
					this.toolsPanel.setActiveTab(this.dataPanel);		
				} else {
					this.dataPanel.expand(false);					
				}
			} else if (this.dataPanel.getCollapsed()!=false) {
				this.dataPanel.expand(false);
			} 	
		}
		
	},

    /**
     * Method: afterRender
     * Metodo privato invocato dopo che il pannello � stato renderizzato.
     * 
     */
	afterRender: function() {
	
		this.callParent(arguments);
		
		if (this.withDataPanel==true) {
			this.api.on("beforeOpenUrl", this.beforeOpenUrl, this);
		}
		
		var thisToolsPanel = this.toolsPanel;
		if (this.legendaPanel) {
			this.legendaPanel.showHandler = function() { thisToolsPanel.expand(true);  };
			this.legendaPanel.hideHandler = function() { thisToolsPanel.collapse(true);};
		}
		if (this.ricercaPanel) {
			this.ricercaPanel.showHandler = function() { thisToolsPanel.expand(true);  };
			this.ricercaPanel.hideHandler = function() { thisToolsPanel.collapse(true);};
		}

	},
	
	/**
     * Method: maximizeDataPanel
     * Massimizza in larghezza il pannello dei dati.
     * 
     */
	maximizeDataPanel : function(){
		if(!this.withDataPanel) return;		
		if(this.dataPanel.collapsed) {
			this.dataPanel.on('expand',this.dataPanel.maximize,this.dataPanel,{single:true});
			this.expandDataPanel(false);
		} else {
			this.dataPanel.maximize();
		}		dataPanel
	},
	
	/**
     * Method: restoreDataPanel
     * Riporta il pannello alla dimensione che aveva prima di essere massimizzato.
     * 
     */
	restoreDataPanel : function(){
		if(!this.withDataPanel) return;		
		if(this.dataPanel.maximized) {
			this.dataPanel.restore();
		}		
	},
	
	/**
     * Method: collapseDataPanel
     * Collassa il pannello dei dati.
     * 
     */
	collapseDataPanel : function(animate){
		if(!this.withDataPanel) return;
		this.dataPanel.collapse(animate);
	},
	
	/**
     * Method: expandDataPanel
     * Espande il pannello dei dati.
     * 
     */
	expandDataPanel : function(animate){
		if(!this.withDataPanel) return;
		this.dataPanel.expand(animate);
	}
	
	
	
});
 