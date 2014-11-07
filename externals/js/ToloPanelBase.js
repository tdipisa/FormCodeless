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
 * Class: TolomeoExt.ToloPanelBase
 *
 * Inherits from:
 *  - <Ext.Panel>
 *
 */
Ext.define('TolomeoExt.ToloPanelBase', {

	extend: 'Ext.Panel',
	alias: 'tx_ToloPanelBase',
	
	/** 
	 * Property: paramsJS
	 * {JSONObject} 
	 */
	paramsJS: null,

	/** 
	 * Property: TOLOMEOServer
	 * {String}
	 */
	TOLOMEOServer: null,

	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,
	
	/** 
	 * Property: TOLOMEOStaticRoot
	 * {String}
	 */
	TOLOMEOStaticRoot: null,

	/** 
	 * Property: toolbarOpt
	 * {Object} Parametri di configurazione per la toolbar 
	 */
	toolbarOpt: null,

	/** 
	 * Property: toolbar
	 * {TolomeoExt.ToloButtonPanelExt} 
	 */
	toolbar: null,
	
	/** 
	 * Property: statusbar
	 */
	statusbar: null,

	/** 
	 * Property: mapPanel
	 * {}
	 */
	mapPanel: null,

	/** 
	 * Property: ricercaPanel
	 * {} 
	 */
	ricercaPanel: null,

	/** 
	 * Property: queryBuilderPanel
	 * {} 
	 */
	queryBuilderPanel: null,
	
	/** 
	 * Property: queryBuilderPanel
	 * {} 
	 */
	codeLessPanel: null,
	
	/** 
	 * Property: legendaPanel
	 * {} 
	 */
	legendaPanel: null,

	/**
	 * {TolomeoExt.ToloStylePanel}
	 * Pannello di gestione degli stili 
	 */
	stylePanel: null,
	
	/** 
	 * Property: viewerConfig
	 * {Object} configurazione che sar� utilizzata per il viewer
	 */
	viewerConfig: null,

	/** 
	 * Property: APIConfig
	 * {Object} configurazione che sar� utilizzata per il viewer
	 */
	APIConfig: null,

	/** 
	 * Property: api
	 * {}
	 */
	api: null,

	/** 
	 * Property: ricercaPanelOpt
	 * {}
	 */
	ricercaPanelOpt: null,
	
	/** 
	 * Property: queryBuilderPanelOpt
	 * {}
	 */
	queryBuilderPanelOpt: null,
	
	/** 
	 * Property: featureGridPanelOpt
	 * {}
	 */
	featureGridPanelOpt: null,
	
	/** 
	 * Property: queryBuilderPanelOpt
	 * {}
	 */
	formCodelessPanelOpt: null,

	/** 
	 * Property: legendaPanelOpt
	 * {}
	 */
	legendaPanelOpt: null,

	/**
	 * @cfg {Object} Opzioni di configurazione dell'eventuale pannello di gestione degli stili. Se non definito non viene attivata la funzionalit� di gestione stili
	 */
	stylePanelOpt: null,	
	
	/** 
	 * Property: mapPanelOpt
	 * {} 
	 */
	mapPanelOpt: null,
	
	/** 
	 * Property: toolsPanelOpt
	 * {} 
	 */
	toolsPanelOpt: null,
	
	/** 
	 * Property: timeMachinePanelOpt
	 * {} 
	 */
	timeMachinePanelOpt: null,
	
	/** 
	 * Property: titoloMappa
	 * {String}
	 */
	titoloMappa: 'Mappa di Prato',
	
	/** 
	 * Property: descrizioneMappa
	 * {String}
	 */
	descrizioneMappa: null,
	
	/** 
	 * Property: stampaReferer
	 * {boolean}
	 */
	stampaReferer: true,
	
	/** 
	 * Property: urlLogo
	 * {String}
	 */
	urlLogo: "",
	
	/** 
	 * Property: urlLogoSecondario
	 * {String}
	 */
	urlLogoSecondario: "",
	
	/** 
	 * Property: withDefaultToolbar
	 * {String}
	 * Impostare a false se non si desidera che il pannello base imposti la propria tbar
	 */
	withDefaultToolbar: true,
	
	/** 
	 * Property: withDefaultStatusbar
	 * {Boolean}
	 * Impostare a false se non si desidera avere la statusBar
	 */
	withDefaultStatusbar: true,

	/**
	 * Constructor: TolomeoExt.ToloPanelBase
	 * Create a new TolomeoExt.ToloPanelBase
	 *
	 * Returns:
	 * {<TolomeoExt.ToloPanelBase>} un nuovo TolomeoExt.ToloPanelBase.
	 */
	initComponent: function() {
		
		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		//this.monitorResize=true;
		
		if (this.toolbarOpt) {
			TolomeoExt.applyIfEmpty(this.toolbarOpt, {
				paramsJS: this.paramsJS, 
				items   : []
			});
			this.toolbar = new TolomeoExt.ToloButtonPanelExt(this.toolbarOpt);
			
			if(this.withDefaultToolbar) {
				this.tbar = this.toolbar;
			}
		}
		
		if(!this.statusbar){
			this.statusbar = new Ext.ux.StatusBar({
	            defaultText: '',
	            statusAlign: 'left',
	            items: []
	        });
	        
	        if(this.withDefaultStatusbar){			
				this.bbar = this.statusbar;
			}
		}		
		
		this.callParent(arguments);
		
		if (this.ricercaPanelOpt) {
    		TolomeoExt.applyIfEmpty(this.ricercaPanelOpt, {
    			title     : 'Trova',
			    autoScroll: 'true',
			    iconCls   : 'iconQuery',
			    paramsJS  : this.paramsJS, 
			    items     : new Array()
    		});
			this.ricercaPanel = new TolomeoExt.ToloQueryPanelExt( this.ricercaPanelOpt );
		}
		
		// ////////////////////////////////////
		// Query Builder and FeatureGrid Panel
		// ////////////////////////////////////
		if (this.queryBuilderPanelOpt) {
			
			var qbEventManager = Ext.create('TolomeoExt.events.ToloQueryBuilderEvtManager');
			
			var qbFeatureManager = Ext.create('TolomeoExt.ToloFeatureManager', {
				TOLOMEOServer: this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext
			});
			
    		TolomeoExt.applyIfEmpty(this.queryBuilderPanelOpt, {
    			title     : 'Query Builder',
			    autoScroll: 'true',
			    iconCls   : 'iconQuery',
			    paramsJS  : this.paramsJS, 
				TOLOMEOServer : this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext,
				caseInsensitiveMatch: false,
				qbFeatureManager: qbFeatureManager,
				qbEventManager: qbEventManager,
				autoCompleteCfg: {
					url: this.TOLOMEOServer + this.TOLOMEOContext + '/UniqueValueServlet',
					pageSize: 10
				},				
				autoComplete: true,
			    items     : new Array()
    		});
			this.queryBuilderPanel = Ext.create('TolomeoExt.ToloQueryBuilderExt',  this.queryBuilderPanelOpt);
			
    		TolomeoExt.applyIfEmpty(this.featureGridPanelOpt, {
    			title     : 'Griglia dei Risultati',
			    autoScroll: 'true',
				border: false,
			    paramsJS  : this.paramsJS, 
			    qbFeatureManager: qbFeatureManager,
			    qbEventManager: qbEventManager,
			    items     : new Array()
    		});
			this.featureGridPanel = Ext.create('TolomeoExt.ToloFeatureGridPanel',  this.featureGridPanelOpt);
		}
		
		// /////////////////////
		// Codeless Panel
		// /////////////////////
		if(this.formCodelessPanelOpt){
    		TolomeoExt.applyIfEmpty(this.formCodelessPanelOpt, {
    			title     : 'Codeless Form',
			    autoScroll: 'true',
			    iconCls   : 'iconCodelss',
			    paramsJS  : this.paramsJS, 
				TOLOMEOServer : this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext,
				cmdToolbar: this.toolbar,
			    items     : new Array()
    		});
			this.codeLessPanel = Ext.create('TolomeoExt.ToloCodeLessPanel',  this.formCodelessPanelOpt);
		}
		
		if (this.legendaPanelOpt) {
			TolomeoExt.applyIfEmpty(this.legendaPanelOpt, {
				title         : 'Legenda interattiva',
				autoScroll    : 'true',
				cls           : 'clearCSS',
				iconCls       : 'iconToc',
				paramsJS      : this.paramsJS,
				TOLOMEOServer : this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext,
				TOLOMEOStaticRoot: this.TOLOMEOStaticRoot,
				xtype         : 'tx_toloTreeTOCPanelExt'
				
			});

			this.legendaPanel =  Ext.widget(this.legendaPanelOpt);
		}

		if (this.stylePanelOpt) {
			TolomeoExt.applyIfEmpty(this.stylePanelOpt, {
				closeAction: 'hide',
				width: 450,
				height: 250
			});
			this.stylePanelOpt.closeAction = 'hide';
			
			this.stylePanel = new TolomeoExt.ToloStylePanel(this.stylePanelOpt); 
		}
		
		
		if (this.timeMachinePanelOpt) {
			
			if (this.timeMachinePanelOpt.carouselConfig) {
				
				TolomeoExt.applyIfEmpty(this.timeMachinePanelOpt.carouselConfig, {
					interval: 3,
				    autoPlay: true,
				    showPlayButton: true,
				    pauseOnNavigate: true,
				    freezeOnHover: true,
				    transitionType: 'fade',
				    transitionEasing: 'fadeIn',    
				    navigationOnHover: false    
					
					});
			} else {
				this.timeMachinePanelOpt.carouselConfig = {
						interval: 3,
					    autoPlay: true,
					    showPlayButton: true,
					    pauseOnNavigate: true,
					    freezeOnHover: true,
					    transitionType: 'fade',
					    transitionEasing: 'fadeIn',    
					    navigationOnHover: false    
						
						};
			}
			
    		TolomeoExt.applyIfEmpty(this.timeMachinePanelOpt, {
    			title     : 'Time Machine',
    			paramsJS      : this.paramsJS
    		});
			this.timeMachinePanel = new TolomeoExt.ToloTimeMachinePanel( this.timeMachinePanelOpt );
		}
		
	    var cfg = Ext.apply({}, this.viewerConfig);		
	    cfg.bOnOpenDrawMap = ((this.APIConfig!=null) && (this.APIConfig.openActionsJS!=null)) ? false : (this.viewerConfig!=null) ? this.viewerConfig.bOnOpenDrawMap : true;
		TolomeoExt.applyIfEmpty (cfg, {
	    	region    : 'center',
	        xtype     : "tx_toloviewerOLPanel",
		    "paramsJS": this.paramsJS
	    });
		
		this.mapPanel = new TolomeoExt.ToloViewerOLPanel(cfg);	 		
		
    },
    
    /**
     * Method: afterRender
     * Metodo privato invocato dopo che il pannello � stato renderizzato.
     * 
     */
    afterRender: function() {	
    	this.callParent(arguments);
    	if (this.api==null) {
	    	var cfg = Ext.apply({}, this.APIConfig);
	    	this.api = Ext.create('TolomeoExt.ToloMapAPIExt', Ext.apply(cfg,{
				"paramsJS"        : this.paramsJS,
				TOLOMEOServer	  : this.TOLOMEOServer,
				TOLOMEOContext	  : this.TOLOMEOContext,
				TOLOMEOStaticRoot : this.TOLOMEOStaticRoot,
				viewer            : this.mapPanel,
				buttonsPanel      : this.toolbar,
				TOCPanel          : this.legendaPanel,
				stylePanel		  : this.stylePanel,
				queryPanel        : this.ricercaPanel,
				queryBuilderPanel : this.queryBuilderPanel,
				featureGridPanel  : this.featureGridPanel,
				codeLessPanel     : this.codeLessPanel,
				titoloMappa       : this.titoloMappa,
				descrizioneMappa  : this.descrizioneMappa,
				urlLogo           : this.urlLogo,
				urlLogoSecondario : this.urlLogoSecondario,
				stampaReferer     : this.stampaReferer,
				statusPanel       : this.statusbar
			}));		    	
		}
    }		
});

