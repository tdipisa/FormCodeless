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
 * Class: TolomeoExt.ToloMapAPIExt
 * Funzioni pubbliche di controllo della mappa (posizione, zoom, evidenziazioni, etc.). 
 *
 * Inherits from:
 *  - <Ext.util.Observable>
 *
 */

Ext.define('TolomeoExt.ToloMapAPIExt', {
	
	 //mixins: {
     //   observable: 'Ext.util.Observable'
    //},


	extend: 'Ext.util.Observable',
	
//TolomeoExt.ToloMapAPIExt = Ext.extend(Ext.util.Observable,{
		
	// Variabili e costanti

	/** 
	 * Property: currentDigitizeOperation
	 * {String} Operazione di digitalizzazione corrente ex var wflgpoliadddel.
	 */
	currentDigitizeOperation: '',	

	/** 
	 * Property: digitizeOperationInsert
	 * {String} Operazione di Inserimento-> 'N' .
	 */
	digitizeOperationInsert: 'N',  

	/** 
	 * Property: digitizeOperationVertexEdit
	 * {String} Operazione di VertexEdit -> 'V'.
	 */
	digitizeOperationVertexEdit: 'V',	 

	/** 
	 * Property: digitizeOperationDragDrop
	 * {String} Operazione di DragDrop -> 'R'.
	 */
	digitizeOperationDragDrop: 'R',	

	/** 
	 * Property: operationGeometryModify
	 * {String} Operazione di generica modifica geometria -> 'G' .
	 */
	operationGeometryModify: "G",  

	/** 
	 * Property: digitizeOperationSubtract
	 * {String} Operazione di Subtract -> 'D' .
	 */
	digitizeOperationSubtract: 'D',	

	/** 
	 * Property: digitizeOperationAdd
	 * {String} Operazione di Add -> 'O' .
	 */
	digitizeOperationAdd: 'O',	

	/** 
	 * Property: digitizeOperationAddSub
	 * {String} Operazione di AddSub -> 'M' .
	 */
	digitizeOperationAddSub: 'M',

	/** 
	 * Property: operationFeatureDelete
	 * {String} Operazione di Cancellazione Feature .
	 */
	operationFeatureDelete: 'C',  

	/** 
	 * Property: operationUpdateAlfa
	 * {String} Operazione di Aggiornamento alfanumerico.
	 */
	operationUpdateAlfa: 'A',  

	/** 
	 * Property: operationIdentify
	 * {String} Operazione di Identify .
	 */
	operationIdentify: 'I', 

	/** 
	 * Property: currentSelectedKeys
	 * {String} Chiavi degli oggetti correntemente selezionati per il layer correntemente sotto editing.
	 */
	currentSelectedKeys: null, 

	/** 
	 * Property: bEditingSingoloInsertDone
	 * {} Indica se in modalit� di editing singolo e' gi� stata effettuata la fase di insert.
	 */
	bEditingSingoloInsertDone:null,

	/** 
	 * Property: bEditingSingoloInsertDone
	 * {Boolean} Indica se in modalit� di editing singolo e' gi� stata effettuata la fase di insert.
	 */
	bEditingSingoloInsertDone: false,

	/** 
	 * Property: eventVis
	 * {Number} Costante che indica l'evento di visualizzazione .
	 */
	eventVis: 0,

	/** 
	 * Property: eventCanc
	 * {Number} Costante che indica l'evento di cancellazione.
	 */
	eventCanc: 1,

	/** 
	 * Property: eventUpdateGeom
	 * {Number} Costante che indica l'evento di aggiornamento geometrico .
	 */
	eventUpdateGeom: 2,

	/** 
	 * Property: eventUpdateAlpha
	 * {Number} Costante che indica l'evento di aggiornamento alfanumerico.
	 */
	eventUpdateAlpha: 3,

	/** 
	 * Property: eventIns
	 * {Number} Costante che indica l'evento di inserimento.
	 */
	eventIns: 4, 	

	/** 
	 * Property: eventRicerca
	 * {Number} Costante che indica l'evento di ricerca.
	 */
	eventRicerca: 5,	

	/** 
	 * Property: eventCustomButton
	 * {Number} Costante che indica l'evento di custom button.
	 */
	eventCustomButton: 6,	

	/** 
	 * Property: currentSelectedLayer
	 * {} layer corrente (codTPN).
	 */
	currentSelectedLayer: null,

	/** 
	 * Property: selezioneCorrente
	 * {JSGeometryArray} Contiene l'oggetto JSGeometry {@link JSGeometry} attualmente selezionato  oppure null se non e' selezionato niente.
	 */
	selezioneCorrente: new JSGeometryArray(),

	/** 
	 * Property: evidenziazioneCorrente
	 * {JSGeometryArray} Contiene l'oggetto JSGeometry {@link JSGeometry} attualmente evidenziato  oppure null se non e' selezionato niente.
	 */
	evidenziazioneCorrente: new JSGeometryArray(),

	/** 
	 * Property: autoIdentifyCorrente
	 * {JSGeometryArray} 
	 */
	autoIdentifyCorrente: new JSGeometryArray(),

	/** 
	 * Property: implicitCustomQuery
	 * {Object} 
	 */
	implicitCustomQuery: new Object(),

	/** 
	 * Property: paramsPrev
	 * {} 
	 */
	paramsPrev: null,

	/** 
	 * Property: submitForm
	 * {Ext.form.FormPanel} 
	 */
	submitForm: null,

	// Config parameters
	/** 
	 * Property: paramsJS
	 * {ToloParamsJS}
	 */
	paramsJS: null, 

	/** 
	 * Property: TOLOMEOServer
	 * {String}
	 */
	TOLOMEOServer: null,
	
	/** 
	 * Property: TOLOMEOStaticRoot
	 * {String}
	 */
	TOLOMEOStaticRoot: null,
	

	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,

	/** 
	 * Property: viewer
	 * {TolomeoExt.ToloViewerOLPanel} 
	 */
	viewer: null,

	/** 
	 * Property: viewer3D
	 */
	viewer3D: null,

	/** 
	 * Property: TOCPanel
	 * {}
	 */
	TOCPanel: null,
	
	tocGuiCreateAction: null,

	/** 
	 * Property: queryPanel
	 * {TolomeoExt.ToloQueryPanelExt}
	 */
	queryPanel: null,
	
	/** 
	 * Property: queryBuilderPanel
	 * {TolomeoExt.ToloQueryBuilderExt}
	 */
	queryBuilderPanel: null,
	
	/** 
	 * Property: codeLessPanel
	 * {TolomeoExt.ToloCodeLessPanel}
	 */
	codeLessPanel: null,

	/** 
	 * Property: buttonsPanel
	 * {TolomeoExt.ToloButtonPanelExt}
	 */
	buttonsPanel: null,

	/** 
	 * Property: selectedChoiceWindow
	 * {}
	 */
	selectedChoiceWindow: null,

	/** 
	 * Property: autoIdentifyWindow
	 * {}
	 */
	autoIdentifyWindow: null,

	/**
	 * @cfg {TolomeoExt.ToloStylePanel} 
	 * 
	 * Pannello di gestione degli stili (se richiesto)
	 * 
	 */
	stylePanel: null,
	
	/** 
	 * Property: geoOpField
	 * {Ext.form.TextField}
	 */
	geoOpField: null,

	/** 
	 * Property: geoCoordField
	 * {Ext.form.TextField}
	 */
	geoCoordField: null,

	/** 
	 * Property: selectedListField
	 * {Ext.form.TextField}
	 */
	selectedListField: null,
	
	/** 
	 * Property: openActionsJS
	 * {String}
	 */
	openActionsJS: null,
	
	/** 
	 * Property: titoloMappa
	 * {String}
	 */
	titoloMappa: 'Mappa di Prato',
	
	/** 
	 * Property: sottotitoloMappa
	 * {String}
	 */
	sottotitoloMappa: null,
	
	/** 
	 * Property: descrizioneMappa
	 * {String}
	 */
	descrizioneMappa: null,
	
	/** 
	 * Property: stampaReferer
	 * {boolean}
	 */
	//stampaReferer: true,
	
	/** 
	 * Property: urlLogo
	 * Url del logo principale che appare in alto a sinistra nella stampa
	 * {String}
	 */
	urlLogo: "",
	
	/** 
	 * Property: urlLogoSecondario
	 * Url del logo che appare in alto a destra nella stampa
	 * {String}
	 */
	urlLogoSecondario: "",
	
	/**
	 * id dei campi che devono contenere il risultati a fine azione
	 * E' composto da un oggetto di questo tipo
	 * {  	geoOp: "actionEndGeoOp", 
	 *		geoCoord: "actionEndGeoCoord", 
	 *		selectedList: "actionEndSelectedList",
	 *		IDTPN: "actionEndIDTPN",
	 *		codTPN: "actionEndCodTPN"}
	 * @type {Object}
	 */
	actionsEndReturnFields: null,
	
	/** 
	 * Property: temporalFilterDtInizio
	 * {String}
	 */
	temporalFilterDtInizio: null,
	
	/** 
	 * Property: temporalFilterDtFine
	 * {String}
	 */
	temporalFilterDtFine: null,
	
	autoCloseChoiceWindow: true,
	
	wmsExplorerWidget: null,
	
	cswWidget: null,
	
	/**
	 * Property: projectionCrs
	 * {Obect} Specifica i sistemi di riferimento da utilizzare nella riproiezione (vedi Mostra Coordinate)
	 */
	
	
	/*'EPSG:26591':{precision: 2, description: 'Gauss Boaga [26591]'},*/
	projectionCrs: {'EPSG:25832':{precision: 2, description: 'ETRS89 / UTM zone 32N [25832]'},'EPSG:3003':{precision: 2, description: 'Gauss Boaga [3003]'},'EPSG:4326':{precision: 7, description: 'WGS84'}},
	
	contextMenu: null,
	
	statusPanel: null,
	
	// Separatore utilizzato per separare stringe di layer e stili
	layerStringSeparator: ',',
   
	/**
	 * Constructor: TolomeoExt.ToloMapAPIExt
	 * Create a new TolomeoExt.ToloMapAPIExt
	 * 
	 *  Parameters:
	 *  config - {Object} La configurazione
	 *  
	 *  Returns:
	 *  {<TolomeoExt.ToloMapAPIExt>} A new TolomeoExt.ToloMapAPIExt
	 */
	constructor: function(config) {

		Ext.apply(this, config);
	    
		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
        TolomeoExt.applyIfEmpty(this, {
        	actionsEndReturnFields: {
        		geoOp:        "actionEndGeoOp", 
				geoCoord:     "actionEndGeoCoord", 
				selectedList: "actionEndSelectedList",
				IDTPN:        "actionEndIDTPN",
				codTPN:       "actionEndCodTPN"
			},
        	temporalFilterDtInizio: "01/01/0001",
        	temporalFilterDtFine  : "31/12/9999"
		});
		
        this.callParent(arguments);
	 
        
		this.bEditingSingoloInsertDone = false;
		
		// Definisco eventi 
	    this.addEvents('onOperationEnable');   		 // passa codice operazione da abilitare
	    this.addEvents('onOperationDisable');		 // passa codice operazione da disabilitare
	    this.addEvents('onOperationPressDefault');	 // passa codice gruppo di cui premere default
	    this.addEvents('onObjectSelect'); 			 // oggetto selezionato utilizando lo strumento di selezione 
	    this.addEvents("actionsEnd"); 				 // lanciato a fine azioni, passa un oggetto contenente geoOp, geoCoord etc. 
	    this.addEvents("digitizedFeatureModifyEnd"); // Eseguita quando una feature digitalizzata viene in un secondo momento modificata
		this.addEvents("onEventActionAjaxSuccess");  // Evento lanciato quando una azioneevento conclude con successo una chiamata ajax.L'evento viene chiamato con i seguenti parametri
													 // eventoLayer, tipoEvento, idBtn, nStep, records, store. 
													 // Se la chiamata non � crossDomain records contiene trasport della chiamata normale e store non c'e'
													 // Utilizzare con codice come il seguente
													 // function a(eventoLayer, tipoEvento, idBtn, nStep, records, store) {
													 //     alert("ale");
													 //	}
													 // function apriMappa(codici) {
													 //	tolomeo = new TolomeoExt.ToloPanelIntra({
													 //		withDataPanel: true,
													 //		withToolsPanel: false,
													 //		APIConfig: {
													 //			listeners: {
													 //       	 		onEventActionAjaxSuccess: {
													 //								fn: a
													 //							      }
													 //				}
													 //			}
													 //	});
	    this.addEvents("onEventActionAjaxFailure");
	    this.addEvents("beforeOpenUrl");			// Evento lanciato prima di una openURL (apertura di url su un certo target alla fine di una azione)
	    this.addEvents("openUrl");					// Evento lanciato alla fine di una openURL (apertura di url su un certo target alla fine di una azione)
	                                                // Parametri: url e target 
	    
	    this.addEvents("beforeClearUrl");			// Evento lanciato prima di una clearURL 
	    this.addEvents("clearUrl");					// Evento lanciato alla fine di una clearURL
	                                                // Parametri: url e target 
	    this.addEvents("visualize");				// Evento lanciato quando viene richiesto di visualizzare i dati di un oggetto. Vengono passati in automatico codTPN e IDTPN
	    this.addEvents("selectRequestBeforeStart"); // Evento lanciato prima di fare la richiesta per recuperare una selezione
	    this.addEvents("selectRequestStart");       // Evento lanciato quando la richiesta per recuperare una selezione � partita
	    this.addEvents("selectRequestEnd");			// Evento lanciato quando la richiesta per recuperare una selezione � finita. Viene passato l'oggetto con l'esito, il numero di risultati ed il messaggio di errore.
	    this.addEvents("tocGuiCreate");	    
	    
	    this.addEvents("afterContextMenuCreate"); 
	    
	    this.geoOpField = Ext.create('Ext.form.TextField', {
	    	name: 'geoOp'
	    });
	    							
	    this.geoCoordField = Ext.create('Ext.form.TextField', {
	    	name: 'geoCoord'
	    });
	    							
		this.selectedListField = Ext.create('Ext.form.TextField', {
			name: 'selectedList'
		});
		
	    this.submitForm = Ext.create('Ext.form.FormPanel', {
			hidden: true,
			renderTo: Ext.getBody(),
			bodyStyle: 'position:absolute; top: 0px; left 0px;',
			standardSubmit: true,
			method: 'POST',
			items: [this.geoOpField, this.geoCoordField, this.selectedListField]
	    });
		
		this.bindToViewerPanel();
		this.bindToButtonsPanel();
		this.bindToQueryPanel();
		this.bindToTOCPanel();
		this.bindToStylePanel();
		this.bindToContextMenu();
		this.bindToStatusPanel();
		
		// ///////////// //
		// QUERY BUILDER //
		// ///////////// //
		this.bindToQueryBuilderPanel();
		
		// ///////////// //
		// CODELESS FORM //
		// ///////////// //
		this.bindToCodeLessPanel();
		
		// TODO Collegare setCurrentLayer all'evento di cambio layer su combo
		
		// TODO Definire eventuali  eventi
		//this.addEvents('permittedOperationsChange'); // TODO Fire
	
		//this.callParent(arguments);
		
		
		// vecchia funzione initTolomeo inizio 
		// this.doOpenActions();
	   	
		//TODO NB: Questi eventi vengono intercettati con successo solo se il layout tolomeo che estende toloPanelBase � incluso in un pannello e non utilizzato direttamente. 
		// Questo perch� nel secondo caso quando arriva qua gli eventi sul viewer sono gia stati lanciati. 
	   	this.viewer.on('onAfterPreInit', function()   { this.applyCustomQuery(); }, this, {single: true});  //this.map.render(this.mapPanel.body.dom);},this,{single: true});
		this.viewer.on('onBeforePostInit', function() { this.doOpenActions(); this.doOpenActionsJS(); },  this, {single: true});  //this.map.render(this.mapPanel.body.dom);},this,{single: true});
		
		
		this.on('objectSelect',function(){
						
		});
	
		// le operazioni consentite potrebbero essere in funzione delle openActions (come per esempio in caso di editSingolo)
		this.togglePermittedOperations();	
		
		// Disegno la mappa
		//this.applyCustomQuery();
		
		// postinizializzazione viewer
		//if (this.viewer) this.viewer.pluginPostInit(this.paramsJS);
	
		// Inizializzazione eventuale legenda
		//if (this.viewer!=null) {
		//	if (this.TOCPanel!=null) {
		//		this.TOCPanel.showTOC(this.viewer.pluginGetCurrentZoom());
		//	}
		//}
		// vecchia funzione initTolomeo fine
		
		htmlInfoTolomeoWin = 
			"<center>" +
			"<b>Comune di Prato</b>" +
			"<br/>" +
			"<b>Tolomeo versione " + TolomeoExt.Vars.TOLOMEOVersion + "</b>" +
			"</center>" +
			"<br/>" +
			"<b>Sito di riferimento</b><br/>" +
			"<a href=\"http://tolomeogis.comune.prato.it\" target=\"_blank\">http://tolomeogis.comune.prato.it</a>"+
			"<br/>" +
			"<br/>" +
			"<b>Librerie utilizzate</b><br/>" +
			"<b><i>Java</i></b><br/>" +
			"SIT core " + this.paramsJS.sitCoreVersion + "<br/>" +			
			"<b><i>Javascript</i></b><br/>" +
			"ExtJS " + Ext.getVersion() + "<br/>" +
			"OpenLayers " + OpenLayers.VERSION_NUMBER + "<br/><br/>" +
			"<b>Copyright Ortofoto</b><br/>" +
			"&copy; Copyright Regione Toscana - ofc anno 2010<br/>" +
			"&copy; Copyright Regione Toscana - ofc 1:2.000 anno 2009<br/>" +
			"&copy; Copyright Regione Toscana - ofc anno 2004 <br/>" +
			"&copy; Copyright Regione Toscana - ofc anno 1998 <br/>";
			
			
		this.tolomeoInfoWin = new Ext.Window({
			
			title: 'Tolomeo',
			bodyStyle: 'padding: 0px',
			cls: 'clearCSS',
			width: 550,
			height: 450,			
			modal: true,
			closeAction: 'hide',
			constrain: true,
			layout: 'fit',
			buttons: [{
	        	text: 'Chiudi',
	       		listeners: {click: {fn: function() {
	       			this.tolomeoInfoWin.hide();
	       		},scope: this}}	       		
	        }],
	        items : {
	        	xtype : 'tabpanel',
	        	activeItem : 0,
	        	minTabWidth : 120,
    			tabWidth    : 135,
    			enableTabScroll: true,
    			border: false,
    			defaults: {
    				xtype: 'panel',
    				layout: 'fit',
    				autoScroll: true
    			},
    			items: [{
    				title: 'Informazioni su Tolomeo',
    				html: htmlInfoTolomeoWin,
    				bodyStyle: 'padding:10px;font-size:12px;line-height:150%',
    				frame: false,
    				border: false,
    				plain: true
    			},{
    				title: 'Licenza',
    				autoScroll: false,    				
    				items: [{
						xtype : 'box',
						id : 'licenseTolomeo',						
						autoEl : {
							tag : 'iframe',
							style : 'border-width: 0px;font-size: 10px',
							src : this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/html/license.html'
						}
					}]
					
    			}]
	        }
		});
		
		
		this.tocInfoField = new Ext.form.TextField({
	    	name: 'tocInfo'
	    });
	    							
	    this.paramsJSField = new Ext.form.TextField({
	    	name: 'paramsJS'
	    });
		
		this.nMappaField = new Ext.form.TextField({
			name: 'nMappa'
		});
		
		this.idxCategoriaBase = new Ext.form.TextField({
			name: 'idxCategoriaBase'
		});
		
		this.idxLayerBase = new Ext.form.TextField({
			name: 'idxLayerBase'
		});

	    this.exportForm = new Ext.form.FormPanel({
			hidden: true,
			renderTo: Ext.getBody(),
			//bodyStyle: 'position:absolute; top: 0px; left 0px;',
			standardSubmit: true,
			method: 'POST',
			defaults: {
				xtype: 'hiddenfield'
			},
			items: [{	
					name: 'tocInfo'
				},{
					name: 'paramsJS'
				},{
					name: 'nMappa'
				},{
					name: 'idxCategoriaBase'
				},{
					name: 'idxLayerBase'
			}]
	    });		
		
	},
	
	/**
	  * Method: bindToTOCPanel
	  * 
	  */
	bindToTOCPanel: function() {
		
		if (this.TOCPanel!=null) {			
			
			if(this.TOCPanel.isTOCCreated){
				if(this.buttonsPanel) this.buttonsPanel.switchTocRelatedButtons(true,true);			
			} else {
				this.TOCPanel.on('tocCreate', function() { 
					//if(this.buttonsPanel) this.buttonsPanel.switchTocRelatedButtons(true,true);
				}, this);
			}
			
			this.relayEvents(this.TOCPanel,['tocGuiCreate']);
			this.TOCPanel.on('afterrender', function() { 
				if (this.viewer.isAlreadyDrawn) {
					this.TOCPanel.createOrUpdate(this.viewer.pluginGetCurrentZoom()); 
				}
			}, this);

			this.TOCPanel.on('layerOpacityChange', this.setLayerOpacity, this);
			this.TOCPanel.on('layerCheckedChange', function(layer){
				if(layer.checked) return;
				if(layer.codTPN && !this.TOCPanel.layerIsVisible(layer.codTPN)){
					this.clearSelected(false,layer.codTPN);
					if(this.selezioneCorrente.size()>0){
						this.fireEvent('onObjectSelect', this.selezioneCorrente.getByIndex(this.selezioneCorrente.size()-1));
					}
				}
			}, this);
			this.TOCPanel.on('categoryCheckedChange', function(category){				
				if(category.checked) return;
				var layers = category.layers;
				for(var i=0;i<layers.length;i++){
					var layer = layers[i];
					if(layer.codTPN && !this.TOCPanel.layerIsVisible(layer.codTPN)){
						this.clearSelected(false,layer.codTPN);
					}
				}
				if(this.selezioneCorrente.size()>0){
					this.fireEvent('onObjectSelect', this.selezioneCorrente.getByIndex(this.selezioneCorrente.size()-1));
				}
			}, this);
			
			this.on('onObjectSelect',function(geoms){
				var geom = geoms.geometries?geoms.geometries[0]:geoms;
				this.TOCPanel.setLayerVisibility(geom.codTPN);
			},this);			
			
			this.TOCPanel.on('stylePanelRequest', this.mostraStylePanel, this);

			this.TOCPanel.on('contextMenuZoomToExtent', this.TOCContextMenuZoomToExtent, this);
			
			this.TOCPanel.on('contextMenuShowInfo', this.TOCContextMenuShowInfo, this);
			this.TOCPanel.on('contextMenuZoomMaxScaleMax', this.TOCContextMenuZoomScaleMax, this);
			this.TOCPanel.on('contextMenuZoomMinScaleMin', this.TOCContextMenuZoomScaleMin, this);
			
			this.TOCPanel.on('itemClicked', this.TOCItemClicked, this);		
			this.TOCPanel.on('exportForQgisClicked', function (catIdx, layIdx) { this.exportForQgis(catIdx, layIdx); }, this);
			
		} else {
			if(this.buttonsPanel) this.buttonsPanel.switchTocRelatedButtons(false,true);
		}
	},
	
	TOCContextMenuZoomToExtent: function (cat, lay, tocInfo) {
		
		var bbox = tocInfo.getBoundingBox(cat, lay) ;
		if (bbox!=null) this.zoomToExtent(bbox, 0);
			
	},
	
	TOCContextMenuShowInfo: function (cat, lay, tocInfo) {
		
		if (lay!=undefined && lay!=null) {
			var layInfo = tocInfo.getCategoryInfo(cat).layers[lay];
			var info = layInfo.layerAbstract;
			
			if (info && info!="") {
			
				var idwin = this.id+'-contextmenushowinfo'+Math.random();
				
				Ext.create('Ext.Window',{
					id: idwin,
					title: 'Informazioni layer ' + layInfo.descr,
					layout: 'fit',
					//iconCls: 'iconPrint',
					frame: true,
					border: true,
					maximizable: true,
					autoScroll:  true,
					//monitorResize: true,
					//plain: true,
					modal: false,
					width: 300,
					height: 150,
					cls: 'clearCSS',
					html: layInfo.layerAbstract,
					buttonAlign: 'right',
					buttons: [{
			            text: 'Chiudi',
			            width: 75,
			            listeners: { click: { fn: function() { Ext.getCmp(idwin).close(); } } }
			        	}]
				}).show();
			} else {
				Ext.Msg.alert('Avviso', 'Nessuna informazione disponibile.');
			}
		} else {
			Ext.Msg.alert('Avviso', 'Nessuna informazione disponibile.');
		}
			
	},

	TOCContextMenuZoomScaleMin: function(cat, lay, tocInfo, scalaminmax) {
		/*
		 *var layInfo = tocInfo.getCategoryInfo(cat).layers[lay];
		
		if (layInfo!=null) {
			// imposto un poco di margine per tenere conto che mapserver ha dpi interi quindi � impostato 91 invece di 90.74 e considero un poco di margine
			var s = layInfo.minScaleMin * 1.01;
			// Scelgo una scala arrontondata a 10 (meno brutta da vedere)
			s = Math.floor(s/10+1) * 10;
			this.zoomToScale(s);
		}*/
		
		var scala = scalaminmax.scalaMinima;
		if (scala!=null) {
			// imposto un poco di margine per tenere conto che mapserver ha dpi interi quindi � impostato 91 invece di 90.74 e considero un poco di margine
			var s = scala * 1.01;
			// Scelgo una scala arrontondata a 10 (meno brutta da vedere)
			s = Math.floor(s/10+1) * 10;
			this.zoomToScale(s);
		}
		
	},
	
	TOCContextMenuZoomScaleMax: function(cat, lay, tocInfo, scalaminmax) {
		/*
		var layInfo = tocInfo.getCategoryInfo(cat).layers[lay];
		
		if (layInfo!=null) {
			// imposto un poco di margine per tenere conto che mapserver ha dpi interi quindi � impostato 91 invece di 90.74 e considero un poco di margine
			var s = layInfo.maxScaleMax * 0.99;
			// Scelgo una scala arrontondata a 10 (meno brutta da vedere)
			s = Math.floor(s/10) * 10;
			this.zoomToScale(s);
		}
		*/
		
		var scala = scalaminmax.scalaMassima;
		if (scala!=null) {
			// imposto un poco di margine per tenere conto che mapserver ha dpi interi quindi � impostato 91 invece di 90.74 e considero un poco di margine
			var s = scala * 0.99;
			// Scelgo una scala arrontondata a 10 (meno brutta da vedere)
			s = Math.floor(s/10) * 10;
			this.zoomToScale(s);
		}
	},
	
	TOCItemClicked: function(catTreeIdx, layTreeIdx, classi, e) {
	
		// TODO Supportata solo mappa 0
		var mappa = this.paramsJS.mappe.mappaList[0];
		
    	if (catTreeIdx && layTreeIdx && !classi ) {
	    	
    		var currCat = this.TOCPanel.tocInfo.getCategoryInfo(catTreeIdx);
			var currLayer =  currCat.layers[layTreeIdx];	
    		
			// Verifica se � definito un link e se l'elemento clickato � un anchor
	    	if (currLayer.clickUrl && e.target.nodeName.toUpperCase()=="A") {
	    		var params = "";
	        	params += (currLayer.codTPN) ? "codTPN=" + currLayer.codTPN : "";
	        	params += ((params!="") ? "&" : "") + "catIdx=" + encodeURIComponent(currLayer.catTreeIdx);  
	        	params += "&layIdx=" + encodeURIComponent(currLayer.layTreeIdx);
	       
	        	// {left: XXX, bottom: XXXXX, right: XXX, top: XXX};
	        	var extent = this.viewer.pluginGetMapExtent();
	        	// tolobbox=x1:x2:y1:y2 che sarebbe il box in coordinate , separate da carattere ":" della mappa nel momento in cui si cliccka su un layer.
	        	params += "&tolobbox=" + extent.left + ":" + extent.right + ":" + extent.bottom + ":" + extent.top;
	        	
	        	// tolosrid
				params += "&tolosrid=" + encodeURIComponent(this.paramsJS.mappe.SRID);
	       
	       		// tolozoom=xxxxx dove xxxxx � il denominatore: se la scala e' 1:12345  sarebbe ...&zoom=12345
				params += "&tolozoom=" + this.viewer.pluginGetCurrentZoom();
	       
				var currCatPreset = this.TOCPanel.tocInfo.getCategoryPresetInfo(catTreeIdx);
				var currLayerPreset =  currCatPreset.layerList[layTreeIdx];
				var server = this.paramsJS.getServer(currLayerPreset.serverID, mappa);
				
				if (server) {
					// tololayerserver
					params += "&tololayerserver=" + encodeURIComponent(server.url);
		       
					// tololayername
		       		params += "&tololayername=" + encodeURIComponent(currLayerPreset.name);
				}	
	        	var retVal = currLayer.clickUrl;
	        	if (params!="") {
	        		retVal += ((retVal.indexOf("?")==-1) ? "?" : "&")  + params ;	
	        	} 
	     		
	        	this.openURL(retVal, currLayer.clickTarget);
	    	}
    	} else if ( catTreeIdx && layTreeIdx==null && !classi){
    		var currCat = this.TOCPanel.tocInfo.getCategoryInfo(catTreeIdx);
			
	    	if (currCat.clickUrl) {
	    		var params = "";
	        	params += "catIdx=" + encodeURIComponent(currCat.catTreeIdx);  
	        	
	        	// {left: XXX, bottom: XXXXX, right: XXX, top: XXX};
	        	var extent = this.viewer.pluginGetMapExtent();
	        	// tolobbox=x1:x2:y1:y2 che sarebbe il box in coordinate , separate da carattere ":" della mappa nel momento in cui si cliccka su un layer.
	        	params += "&tolobbox=" + extent.left + ":" + extent.right + ":" + extent.bottom + ":" + extent.top;
	        	
	        	// tolosrid
				params += "&tolosrid=" + encodeURIComponent(this.paramsJS.mappe.SRID);
	       
	       		// tolozoom=xxxxx dove xxxxx � il denominatore: se la scala e' 1:12345  sarebbe ...&zoom=12345
				params += "&tolozoom=" + this.viewer.pluginGetCurrentZoom();
	       
	        	var retVal = currCat.clickUrl;
	        	if (params!="") {
	        		retVal += ((retVal.indexOf("?")==-1) ? "?" : "&")  + params ;	
	        	} 
	     		
	        	this.openURL(retVal, currCat.clickTarget);
	    	}
    	}
		
	},
	
	/**
	 * Mostra il pannello di gestione degli stili
	 * 
	 * @param {String} nome del layer
	 * @param {Number} numero categoria del layer 
	 * @param {Number} numero del layer
	 * @param {String[][]} Elenco degli stili definiti per il layer nella forma [['stile1'],['stile2']] 
	 */ 
	 mostraStylePanel: function(nome, cat, lay, definedStyles) {
		
		if (this.stylePanel) {
			this.stylePanel.mostra(nome, cat, lay, definedStyles);	
		}
		
	},
	
	/**
	 * Nasconde il pannello di gestione degli stili
	 * 
	 */
	nascondiStylePanel: function() {
		
		if (this.stylePanel) this.stylePanel.nascondi();
		
	},
	
	/**
	 * Method: setLayerOpacity
	 * Metodo per impostare l'opacit� del layer. 
	 *
	 * Parameters:
	 * nomeLayer - {} il nome del layer.
	 * newValue - {} il nuovo valore.
	 */
	setLayerOpacity: function (catIdx, layIdx, newValue, oldValue, tocInfo  ) {
		 
		 
		// Se il layer era totalmente opaco o se lo diventa occorre ricalcolare i raggruppamenti
		if ((newValue!=1 && oldValue==1) ||
			(oldValue!=1 && newValue==1)) {
	
			// Ricrea la mapDefinition a partire dalle info di tocInfo (quindi con nuovo valore di trasparenza)
			this.viewer.pluginRemoveAllLayers();
			this.paramsJS.createMapDefinition(tocInfo);
			this.viewer.pluginAddAllMaps(false);
			
			if (this.viewer3D) {
				this.viewer3D.removeAllLayers();
				this.viewer3D.addAllLayers();	
			}
		} else {
			// ... altrimenti � solo un cambio di opacit� senza ricalcolo gruppo
			// TODO gestisce solo mappa 0
			var layAgg = this.paramsJS.mapDefinitions[0].whichLayerAggregationContains(catIdx, layIdx);
			layAgg.opacity = newValue;
			this.viewer.pluginSetLayerOpacity(layAgg.nPluginLayer, newValue);
			
		} 
	},

 	/**
     * Method: bindToQueryPanel
     * 
     */
	bindToQueryPanel: function() {

		if (this.queryPanel!=null) {
			this.queryPanel.on('queryMultipleResultHoverStart', this.addHighlighted, this);
			this.queryPanel.on('queryMultipleResultOut', this.clearHighLigthed, this);
			
			this.queryPanel.on('geomFilterFieldCreated', this.queryPanelSetGeomField, this);
			
			this.queryPanel.on(
				'querySelected',
				function(geoms) { 
					var geom = geoms.geometries[0]; 					
					//senza redraw pwrch� faceva chiamate fantasma.
					if(this.paramsJS.isSelectable(geom.codTPN)){
						this.clearSelected(false); 
						this.addSelected(geom); 
						this.zoomToSelected(null,200);
					}else{						
						this.clearHighLigthed(false);
						this.addHighlighted(geom); 
						this.zoomToHighlighted(null,200);
					}
					
					/*
					var selLayer = this.getCurrentSelectLayer();
					if (selLayer!=null) {
						if (selLayer.azioniEventiVis.autoVisOnSelect) {
							var layer = this.paramsJS.getParamJSLayer(geoms.geometries[0].codTPN);
							//this.setCurrentSelectLayer(geoms.geometries[0].codTPN);
							this.identify(layer);
						}
					}
					*/
				}, 
				this
			);
		}
	},

	queryPanelSetGeomField: function() {
		var box = this.viewer.pluginGetMapExtent();
		var p1 = "" +  box.left + " " + box.top;
		var p2 = "" +  box.left + " " + box.bottom;
		var p3 = "" +  box.right + " " + box.bottom;
		var p4 = "" +  box.right + " " + box.top;
		
		var geom = "POLYGON((" + p1 + "," + p2 + "," + p3 + "," + p4 + "," + p1+ "))";
		this.queryPanel.setGeomFilterField(geom);
	},
	
	
	/**
	 * Method: bindToViewerPanel
	 * 
	 */
	bindToViewerPanel: function() {
		
		if (this.viewer!=null) {
			
			if (this.TOCPanel!=null) {
				var viewer = this.viewer;
				var api = this;
				//this.viewer.on('scalechange', function(scale) { this.requestVisibleData(scale); }, this.TOCPanel);
				this.viewer.on('scalechange', function(scale) { 
					this.createOrUpdate(scale); 
				}, this.TOCPanel);			
					
				if (this.queryPanel) {
					this.viewer.on('onMapMoveEnd', this.queryPanelSetGeomField, this);
				}
				
				//loadend
				this.viewer.addListener('onAfterPostInit', function() {
					this.TOCPanel.createOrUpdate(this.viewer.pluginGetCurrentZoom());
				}, this, { single: true });
													
				//TODO ma quando arriva qua probabilmente afterlayout lo ha gi� fatto!!!
				//this.viewer.on('afterlayout', function() { api.TOCPanel.showTOC(viewer.pluginGetCurrentZoom()); }, this.TOCPanel, {single:true});
		
				this.TOCPanel.on('layerCheckedChange', this.onLegendaCheckLayerChange, this);
				this.TOCPanel.on('categoryCheckedChange', this.onLegendaCheckCategoryChange, this);
				this.TOCPanel.on('layerOrderChanged', this.onLegendaOrderChange, this);
				this.TOCPanel.on('layerStyleChanged', this.onLegendaStyleChange, this);
				
				this.TOCPanel.on('categoryAdded', this.onLegendaCategoryAdded, this);
				this.TOCPanel.on('layerAdded', this.onLegendaLayerAdded, this);
				
				this.TOCPanel.on('contextMenuAddWMSFromCatalogClick', this.addWMSFromCatalogChoose, this);
				this.TOCPanel.on('contextMenuAddWMSFromWMSWidgetClick', this.addWMSFromWMSWidgetChoose, this);
				
				
			}
						
			this.viewer.on('onAutoIdentify', this.onAutoIdentify, this);
			this.viewer.on('onAutoIdentifyCancel', this.onAutoIdentifyCancel, this);
			
			// Registrazione in viewerPanel
			//this.viewer.on('onMeasureStart', this.onMeasureCallback, this);
			//this.viewer.on('onMeasureStop', this.onMeasureCallback, this);
			//this.viewer.on('onMeasureChanging', this.onMeasureCallback, this);
			//this.viewer.on('onMeasureChanged', this.onMeasureCallback, this);
			//this.viewer.on('onMeasureClear', this.onMeasureCallback, this);
			
			this.viewer.on('onDigitizeEndPoint',         this.onDigitizeEndPoint, this);
			this.viewer.on('onDigitizeEndLine',          this.onDigitizeEndLine, this);
			this.viewer.on('onDigitizeEndPolygon',       this.onDigitizeEndPolygon, this);
			this.viewer.on('onDigitizeEndVertexEditing', this.onDigitizeEndVertexEditing, this);
			this.viewer.on('onDigitizeEndDragDrop',      this.onDigitizeEndDragDrop, this);
			//this.viewer.on('onMappaSelect',              function (point,selectionMode,addToSelected,visualize) {this.onMappaSelect(point,selectionMode,addToSelected,visualize); }, this );
			this.viewer.on('onMappaSelect',              this.onMappaSelect, this );
			this.viewer.on('onPrintMap',                 this.showPrintWindow,  this );
			//this.viewer.on('onCoordinateChange',		 this.showCoordinate, this)
			
			this.viewer.on('onTimeMachineHide', function() {this.buttonsPanel.buttonToggle(TolomeoExt.ToloAPIOpCodes.btnTimeMachine, null, true)},  this );
			
			if (this.statusPanel) {
				//id: id+"-statusPanelCoordPnl",
			
				var coordPnl = new Ext.Toolbar.TextItem({ cls: 'x-status-text-panel'});			
				var bFatto=false;
				// Dovuto sovrascrivere il metodo facendo in modo che updateLAyout fosse lanciato una volta solo perch� altrimenti era lentissimo
				coordPnl.setText= function(text) {
			        var me = coordPnl;
			        me.text = text;
			        if (me.rendered) {
			            me.el.update(text);
			            if (!bFatto) {
			            	bFatto=true;
			            	me.updateLayout();
			            }
			        }
			    }
				this.statusPanel.add(coordPnl);
				
				this.viewer.on('onMouseCoordChange', 
						function(coords,units,srid){
							var nDec = (units=='degrees' || units=='dd') ? 4 : 0;
							
							var x = this.addThousandSeparator(coords.x.toFixed(nDec), '.', ',');
							var y = this.addThousandSeparator(coords.y.toFixed(nDec), '.', ',');
							
							var msg = (srid ? srid + '&nbsp;&nbsp;' : '') + "X: " + x+'&nbsp;&nbsp;'+"Y: " + y;
							
							coordPnl.setText(msg);
							} , this);
							//this.statusPanel.find("id",this.id+"-statusPanelCoordPnl")[0].setText("X: " + x+'&nbsp;&nbsp;'+"Y: " + y);} , this);
			}
			
			
		}
	},

	
	/*
	 * addPointCatIdx: (addPointCatIdx) ? addPointCatIdx : "0",
	 							addPointLayIdx: (addPointLayIdx) ? addPointLayIdx : undefined,
	 							bBefore: bBefore
	 */
	
	addWMSFromWMSWidgetChoose: function(addPointCatIdx, addPointLayIdx, bBefore) {
		
		this.wmsExplorerWidgetActivate(addPointCatIdx, addPointLayIdx, bBefore);
		
	},
	
	addWMSFromCatalogChoose: function(addPointCatIdx, addPointLayIdx, bBefore) {
		
		this.cswWidgetActivate(addPointCatIdx, addPointLayIdx, bBefore);
		
	},
	
	addThousandSeparator: function (str, thousandSeparator, decimalSeparator) {
		var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})'),
		sValue = str + "", // to be sure we are dealing with a string
		arrNum = [];

		if (thousandSeparator === undefined) {thousandSeparator = ","; }
		if (decimalSeparator === undefined) {decimalSeparator = "."; }

		arrNum = sValue.split(decimalSeparator);
		// let's be focused first only on the integer part
		sValue = arrNum[0];

		while(sRegExp.test(sValue)) {
		sValue = sValue.replace(sRegExp, '$1' + thousandSeparator + '$2');
		}

		// time to add back the decimal part
		if (arrNum.length > 1) {
		sValue = sValue + decimalSeparator + arrNum[1];
		}
		return sValue;
	},
	
	onLegendaCheckLayerChange: function(layerInfo) {
		
		
		if (layerInfo.itemType=='layer') {
			// TODO gestita solo mappa 0
			var nMappa = 0;
			
			var layerAggreg = this.paramsJS.updateMapDefinitionLayerCheckState(nMappa, layerInfo);		
			var layAndStyle = this.paramsJS.getLayerAggregLayersAndStylesStrings(nMappa, layerAggreg.nPluginLayer, this.layerStringSeparator,this.viewer.pluginGetCurrentZoom()); 
			
			this.viewer.pluginRefreshMap(layAndStyle.layers, layAndStyle.stili, this.layerStringSeparator, layerAggreg.nPluginLayer);
			
			if (this.viewer3D) {
				this.viewer3D.refreshMap(layerAggreg.nPluginLayer);	
			}
		}
		
	},
	
	onLegendaCheckCategoryChange: function(catInfo, tocInfo) {
		// TODO gestita solo mappa 0
		var nMappa = 0;
		
		var layerAggregArray = this.paramsJS.updateMapDefinitionCategoryCheckState(nMappa, tocInfo, catInfo);
		for (var i=0; i<layerAggregArray.length; i++) {
			var layerAggreg = layerAggregArray[i];
			var layAndStyle = this.paramsJS.getLayerAggregLayersAndStylesStrings(nMappa, layerAggreg.nPluginLayer, this.layerStringSeparator, this.viewer.pluginGetCurrentZoom()); 
			this.viewer.pluginRefreshMap(layAndStyle.layers, layAndStyle.stili, this.layerStringSeparator, layerAggreg.nPluginLayer);
			if (this.viewer3D) {
				this.viewer3D.refreshMap(layerAggreg.nPluginLayer);	
			}
		}
		
	},

	onLegendaOrderChange: function(tocInfo) {
		
		// Ricrea la mapDefinition a partire dalle info di tocInfo (quindi con il nuovo ordine
		this.viewer.pluginRemoveAllLayers();
		this.paramsJS.createMapDefinition(tocInfo);
		this.viewer.pluginAddAllMaps(false);
		if (this.viewer3D) {
			this.viewer3D.removeAllLayers();
			this.viewer3D.addAllLayers();	
		}
		
	},
	
	//TODO verificare se serve sempre ed eventualmente eliminare
	onLegendaStyleChange: function(layerInfo, style) {
		
		// TODO gestita solo mappa 0
		var nMappa = 0;
		
		var layAggr = this.paramsJS.updateMapDefinitionLayerStyle(nMappa, layerInfo, style); 		
		var layAndStyle = this.paramsJS.getLayerAggregLayersAndStylesStrings(nMappa, layAggr.nPluginLayer, this.layerStringSeparator,this.viewer.pluginGetCurrentZoom()); 
		this.viewer.pluginRefreshMap(layAndStyle.layers, layAndStyle.stili, this.layerStringSeparator, layAggr.nPluginLayer);	
		if (this.viewer3D) {
			this.viewer3D.refreshMap(layerAggreg.nPluginLayer);	
		}

	},
	
	onLegendaCategoryAdded: function(tocInfo, catInfo) {
		
		// TODO Si pu� ottimizzare? Cos� ricalcolo tutto...
		// Se si assume che venga inserita una categoria vuota basterebbe (forse) reindicizzare le layerAggregations
		this.viewer.pluginRemoveAllLayers();
		this.paramsJS.createMapDefinition(tocInfo);
		this.viewer.pluginAddAllMaps(false);
		if (this.viewer3D) {
			this.viewer3D.removeAllLayers();
			this.viewer3D.addAllLayers();	
		}
		
	},
			
	onLegendaLayerAdded: function(tocInfo, paramsLayInfo, layTocInfo, serverInfo) {
		//TODO ALE
		this.buttonsPanel.a(this.paramsJS.azioniEventi.eventiLayerList);
		this.togglePermittedOperations();
		
		// TODO Si pu� ottimizzare? Cos� ricalcolo tutto... tenere presente che il layer aggiunto non � presente negli attuali raggruppamenti
		this.viewer.pluginRemoveAllLayers();
		this.paramsJS.createMapDefinition(tocInfo);
		this.viewer.pluginAddAllMaps(false);
		if (this.viewer3D) {
			this.viewer3D.removeAllLayers();
			this.viewer3D.addAllLayers();	
		}
		
	},
	
	bindToStylePanel: function() {
		
		if (this.stylePanel) {
			//styleApply: { fn: this.setLayerStyle, scope: this }
			if (this.TOCPanel) {
				this.stylePanel.on('styleApply', this.TOCPanel.setLayerStyle, this.TOCPanel); 
			}
		}
	},
	
	 /**
	    * Method: bindToButtonsPanel
	    * 
	    */
	bindToButtonsPanel: function() {
		// Bind con eventi buttonPanel (se presente
		if (this.buttonsPanel) {
			this.buttonsPanel.on('onTimeMachinePressFn', function() { this.viewer.pluginShowTimeMachine(true); }, this);
			this.buttonsPanel.on('onTimeMachineReleaseFn', function() { this.viewer.pluginShowTimeMachine(false); }, this);
			
			
			this.buttonsPanel.on('onPanPressFn', this.viewer.pluginToolSelectPan, this.viewer);
			this.buttonsPanel.on('onPanReleaseFn', this.viewer.pluginToolSelectPanStop, this.viewer);
			
			this.buttonsPanel.on('onCustomButtonPressFn',   function (btn) { this.onCustomButtonPress(btn)  }, this);
			this.buttonsPanel.on('onCustomButtonReleaseFn', function (btn) { this.onCustomButtonRelease(btn)}, this);
			
			this.buttonsPanel.on('onNuovoPressFn',   function (button) {
				switch(button.newType){
					case 0:
						this.onDigitizeStart(this.digitizeOperationInsert);
					break;
					case 1:
						this.onDigitizeByCADStart(this.digitizeOperationInsert);
					break;
				} 
			}, this );
			this.buttonsPanel.on('onNuovoReleaseFn', function (button) {
				switch(button.newType){
					case 0: 
						this.onDigitizeStop(this.digitizeOperationInsert);
					break;
					case 1:
						this.onDigitizeByCADStop(this.digitizeOperationInsert);
					break;		
				}			  
			}, this );
			
			this.buttonsPanel.on('onPanNordPressFn',  function () { this.panNord(null);  }, this);
			this.buttonsPanel.on('onPanSudPressFn',   function () { this.panSud(null);   }, this);
			this.buttonsPanel.on('onPanOvestPressFn', function () { this.panOvest(null); }, this);
			this.buttonsPanel.on('onPanEstPressFn',   function () { this.panEst(null);   }, this);
			
			this.buttonsPanel.on('onZoomInPressFn',  this.viewer.pluginToolSelectZoomIn,  this.viewer);
			this.buttonsPanel.on('onZoomOutPressFn', this.viewer.pluginToolSelectZoomOut, this.viewer);
			this.buttonsPanel.on('onZoomBoxPressFn', this.viewer.pluginToolSelectZoomBoxActivate, this.viewer);
			this.buttonsPanel.on('onZoomBoxReleaseFn', this.viewer.pluginToolSelectZoomBoxDeactivate, this.viewer);			
			this.buttonsPanel.on('onZoomAllPressFn', this.viewer.pluginToolSelectZoomAll, this.viewer);
		    
		    // TODO DA TRASFERIRE su viewer? Non sono coinvolti metodi dell'API
			this.buttonsPanel.on('onMeasureActivate',   function (type) { this.viewer.pluginMeasureToolSelect(type); }, this);
			this.buttonsPanel.on('onMeasureDeactivate', this.viewer.pluginMeasureStop, this.viewer);
			this.buttonsPanel.on('onMeasureTypeChange', function (type) { this.viewer.pluginMeasureStop(); this.viewer.pluginMeasureToolSelect(type); }, this );
		    
			this.buttonsPanel.on('onPrintPressFn', this.viewer.pluginToolSelectPrint, this.viewer);
		    
		    //TODO
			if (this.TOCPanel!=null)   this.buttonsPanel.on('onLegendPressFn',   function() { this.TOCPanel.showTOC(this.viewer.pluginGetCurrentZoom()); }, this);
			if (this.TOCPanel!=null)   this.buttonsPanel.on('onLegendReleaseFn', this.TOCPanel.hideTOC, this.TOCPanel);
			if (this.queryPanel!=null) this.buttonsPanel.on('onQueryPressFn',    this.queryPanel.showQuery, this.queryPanel);
			if (this.queryPanel!=null) this.buttonsPanel.on('onQueryReleaseFn',  this.// TODO STILI
					queryPanel.hideQuery, this.queryPanel);
		    
			this.buttonsPanel.on('onSelectPressFn',   this.viewer.pluginToolSelectSelect,     this.viewer);
		    this.buttonsPanel.on('onSelectReleaseFn', this.viewer.pluginToolSelectSelectStop, this.viewer);
			this.buttonsPanel.on('onIdentifyPressFn', this.onIdentify,                        this);
		    //this.buttonsPanel.on('onIdentifyReleaseFn', this);
		    
			this.buttonsPanel.on('onDeletePressFn',     this.onDelete,     this);
			this.buttonsPanel.on('onUpdateAlfaPressFn', this.onUpdateAlfa, this);
			this.buttonsPanel.on('onAddPressFn',        function () { this.onDigitizeStart(this.digitizeOperationAdd); }, this);
		    
			this.buttonsPanel.on('onAddReleaseFn',        function () { this.onDigitizeStop(this.digitizeOperationAdd);         }, this);
			this.buttonsPanel.on('onSubtractPressFn',     function () { this.onDigitizeStart(this.digitizeOperationSubtract);   }, this);
			this.buttonsPanel.on('onSubtractReleaseFn',   function () { this.onDigitizeStop(this.digitizeOperationSubtract);    }, this);
			this.buttonsPanel.on('onAddSubPressFn',       function () { this.onDigitizeStart(this.digitizeOperationAddSub);     }, this);
			this.buttonsPanel.on('onAddSubReleaseFn',     function () { this.onDigitizeStop(this.digitizeOperationAddSub);      }, this);
			this.buttonsPanel.on('onVertexEditPressFn',   function () { this.onDigitizeStart(this.digitizeOperationVertexEdit); }, this);
			this.buttonsPanel.on('onVertexEditReleaseFn', function () { this.onDigitizeStop(this.digitizeOperationVertexEdit);  }, this);
			this.buttonsPanel.on('onDragDropPressFn',     function () { this.onDigitizeStart(this.digitizeOperationDragDrop);   }, this);
		    
			this.buttonsPanel.on('onDragDropReleaseFn',       function () { this.onDigitizeStop(this.digitizeOperationDragDrop); } , this);
			this.buttonsPanel.on('onAnnullaSelezioniPressFn', this.onAnnullaSelezioni, this);
		    
			this.buttonsPanel.on('onTemporalFilterApply', this.temporalFilterApply, this);
			
			this.buttonsPanel.on('onAutoIdentifyPressFn',   function () {this.autoIdentifyEnable(true); }, this);
			this.buttonsPanel.on('onAutoIdentifyReleaseFn', function () {this.autoIdentifyEnable(false); }, this);			
			this.buttonsPanel.on('onSelectLayer',           function (codTPN) { this.setCurrentSelectLayer(codTPN); }, this);
			
			this.buttonsPanel.on('onSnapPressFn',   function () { this.viewer.pluginSnapActivate(this.currentSelectedLayer); }, this);
			this.buttonsPanel.on('onSnapReleaseFn', function () { this.viewer.pluginSnapClear(); }, this);
			this.buttonsPanel.on('onCswPressFn', function () { this.cswWidgetActivate(); }, this);
			this.buttonsPanel.on('onCswReleaseFn', function () { this.cswWidgetDeactivate(); }, this);
			this.buttonsPanel.on('onWMSPressFn', function () { this.wmsExplorerWidgetActivate(); }, this);
			this.buttonsPanel.on('onWMSReleaseFn', function () { this.wmsExplorerWidgetDeactivate(); }, this);
			this.buttonsPanel.on('showPermalinkClicked', function () { this.showPermalink(); }, this);
			this.buttonsPanel.on('exportForQgisClicked', function (catIdx, layIdx) { this.exportForQgis(catIdx, layIdx); }, this);
			this.buttonsPanel.on('showTolomeoInfoClicked', function () { this.tolomeoInfoWin.show();}, this);
			this.buttonsPanel.on('showCustomInfoClicked', function (args) { this.showCustomInfo(args);}, this);
			this.buttonsPanel.on('regeneratePageClicked', function () { this.regeneratePage();}, this);
			this.buttonsPanel.on('showGuideClicked', function (url) { this.showGuide(url);}, this);
			this.buttonsPanel.on('showFaqClicked', function (url) { this.showFaq(url);}, this);
			this.buttonsPanel.on('mailToAdministratorClicked', function (to,subject) { this.mailToAdmin(to,subject);}, this);
			
			this.buttonsPanel.bindToAPI(this);
		}
	},
	
  /**
    * Method: bindToContextMenu
    * Crea il contextMenu se non esiste, lo lega al viewer e ne gestisce gli eventi
    * 
    */
	bindToContextMenu: function() {
		// Bind con eventi contextMenu 
		if (!this.contextMenu) {
			this.contextMenu = new TolomeoExt.ToloContextMenu({projectionCrs:this.projectionCrs,allowOtherMenus: false});
			this.fireEvent("afterContextMenuCreate", this.contextMenu);
		}
		if (this.viewer.map) {
			this._registerContextMenu();		
		} else {
			this.viewer.on('onAfterPostInit', 
				function(ev) {
					this._registerContextMenu();
					/*
					this.contextMenu.setCrsSelected(this.getProjectionCode());
					this.viewer.getEl().on('contextmenu', // TODO STILI
							
						function(e) {
							e.preventDefault(); 
							this.contextMenu.showAt(e.getXY());						
						}, this);*/
					}
				, this,{single: true});
		}
			
		this.contextMenu.on('onGotoLocClickFn', this.gotoLocationEnable, this);
		this.contextMenu.on('onReleaseLocClickFn', this.releaseLocationEnable, this);
		this.contextMenu.on('onReleaseStreetviewClickFn', this.releaseStreetviewEnable, this);
		this.contextMenu.on('onNotaClickFn', this.insertNoteOnMap, this);
		//this.contextMenu.on('mouseout', function(){this.hide();}, this.contextMenu);
	},
	
	_registerContextMenu: function() {
		this.contextMenu.setCrsSelected(this.getProjectionCode());
		this.viewer.getEl().on('contextmenu', // TODO STILI				
			function(e) {
				e.preventDefault(); 
				this.contextMenu.showAt(e.getXY());						
			}, this);
	},

	bindToStatusPanel: function(){
		if(this.statusPanel){
		
			this.setStatusMode = function(functionMode,functionType){
				if(!functionMode) return;
				this.statusPanel.defaultText="Modalit&agrave; <b>" + functionMode + "</b>" + (functionType?" : " + functionType : "");
				this.statusPanel.clearStatus({useDefaults:true});
			}
			
			this.on('selectRequestBeforeStart',function(){this.statusPanel.showBusy('Selezione oggetti...');},this);
			this.on('selectRequestEnd',function(esito){				
				this.statusPanel.setStatus({
				    text: esito.ok?'Oggetti trovati : '+ esito.nResults:'Errore durante la selezione',
				    iconCls: esito.nResults==0?'x-status-error':'x-status-valid',
				    clear: true // auto-clear after a set interval
				});
			},this);
			
			if(this.statusPanel.rendered){
				this.setStatusMode("panoramica");
			}else{
				this.statusPanel.on('afterrender',function(){this.setStatusMode("panoramica");},this)
			}
			
			if(this.buttonsPanel){
				this.buttonsPanel.on('onPanPressFn',        function(){this.setStatusMode("panoramica");},this);
				this.buttonsPanel.on('onZoomBoxPressFn',    function(){this.setStatusMode("panoramica","zoombox");} , this);
				this.buttonsPanel.on('onSelectPressFn',     function(){this.setStatusMode("selezione");} , this);
				this.buttonsPanel.on('onNuovoPressFn',      function(){this.setStatusMode("editing","inserimento nuovo oggetto");} , this);
				this.buttonsPanel.on('onUpdateAlfaPressFn', function(){this.setStatusMode("editing","aggiornamento dati alfanumerici");} , this);
				this.buttonsPanel.on('onAddPressFn',        function(){this.setStatusMode("editing","unione con nuovo poligono");} , this);
				this.buttonsPanel.on('onSubtractPressFn',   function(){this.setStatusMode("editing","sottrazione di nuovo poligono");} , this);
				this.buttonsPanel.on('onAddSubPressFn',     function(){this.setStatusMode("editing","modifica copertura poligoni");} , this);
				this.buttonsPanel.on('onVertexEditPressFn', function(){this.setStatusMode("editing","modifica vertici");} , this);
				this.buttonsPanel.on('onDragDropPressFn',   function(){this.setStatusMode("editing","drag &amp; drop oggetto");} , this);
				this.buttonsPanel.on('onMeasureActivate',   function(measureType){this.setStatusMode("misurazione",(measureType==0?"poligono":(measureType==1?"cerchio":"linea")));}, this);
				this.buttonsPanel.on('onMeasureTypeChange', function(measureType){this.setStatusMode("misurazione",(measureType==0?"poligono":(measureType==1?"cerchio":"linea")));}, this);
			}
		}
	},
	
	bindToQueryBuilderPanel: function(){
		var mapApiExt = this;
		var tolomeoViewer = mapApiExt.viewer;
		tolomeoViewer.on("onAfterPreInit", function(){
			if(mapApiExt.queryBuilderPanel){
				var qbEventManager = mapApiExt.queryBuilderPanel.getQbEventManager();
				qbEventManager.setMap(tolomeoViewer.map);
			}
		})		
		
//		qbEventManager.on('polygonSpatialSelectorActive', function(scope){			
//		}, this);
	},
	
	bindToCodeLessPanel: function(){
		var mapApiExt = this;
		var tolomeoViewer = mapApiExt.viewer;
		tolomeoViewer.on("onAfterPreInit", function(){
			if(mapApiExt.codeLessPanel){
				mapApiExt.codeLessPanel.setMapApiExt(mapApiExt);
			}
		})	
	},
	
	setViewer3D: function(viewer3D) {
		this.viewer3D = viewer3D;
	},

	/**
	 * Method: temporalFilterApply
	 * Applica il filtro temporale
	 * 
	 */
	temporalFilterApply: function(dtInizio, dtFine){
		this.temporalFilterDtInizio = (dtInizio != null && dtInizio!="") ? Ext.Date.format(dtInizio,"d/m/Y") : "01/01/0001";
		this.temporalFilterDtFine   = (dtFine   != null && dtFine!="") ? Ext.Date.format(dtInizio,"d/m/Y") : "31/12/2099";
		this.applyCustomQuery();
	},
	
	/**
	 * Method: zoomIn
	 * Esegue lo zoom avanti.
	 * 
	 */
	zoomIn: function(){
		this.viewer.pluginToolSelectZoomIn();		
	},
	
	/**
	 * Method: zoomOut
	 * Esegue lo zoom indietro.
	 * 
	 */
	zoomOut: function(){
		this.viewer.pluginToolSelectZoomOut();
	},
	
	/**
	 * Method: zoomBox
	 * Esegue lo zoom box.
	 * 
	 */
	zoomBox: function(){
		this.viewer.pluginToolSelectZoomBox();
	},

	/**
	 * Method: pan
	 * Esegue il pan.
	 * 
	 * Parameters:
	 * direction - {} direzione di spostamento.
	 * slideFactorPan - {} tolleranza di spostamento
	 */
	pan: function(direction, slideFactorPan){
		this.viewer.pluginPan(direction,slideFactorPan);
	},

	/**
	 * Method: panNord
	 * Esegue il pan verso nord.
	 * 
	 * Parameters:
	 * slideFactor - {} tolleranza di spostamento
	 */
	panNord: function(slideFactorPan){
		this.pan("N",slideFactorPan);
	},

	/**
	 * Method: panSud
	 * Esegue il pan verso sud.
	 * 
	 * Parameters:
	 * slideFactor - {} tolleranza di spostamento
	 */
	panSud: function(slideFactorPan){
		this.pan("S",slideFactorPan);
	},

	/**
	 * Method: panOvest
	 * Esegue il pan verso ovest.
	 * 
	 * Parameters:
	 * slideFactor - {} tolleranza di spostamento
	 */
	panOvest: function(slideFactorPan){
		this.pan("O",slideFactorPan);
	},

	/**
	 * Method: panEst
	 * Esegue il pan verso est.
	 * 
	 * Parameters:
	 * slideFactor - {} tolleranza di spostamento
	 */
	panEst: function(slideFactorPan){
		this.pan("E",slideFactorPan);
	},
	
	showTimeMachine: function(show) {
		if (this.viewer) this.viewer.pluginShowTimeMachine(show);
	},
	
	/**
	 * Method: showPrintWindow
	 * Crea una wizard di stampa su una finestra. Nel primo passo imposto la stampa nel secondo la genero.
	 *
	 * Parameters:
	 * url - {String} url.
	 */
	showPrintWindow: function(url) {
		
		var server        = this.TOLOMEOServer;
		var context       = this.TOLOMEOContext;
		var urlMappa      = url;
		var scala         = this.viewer.pluginGetCurrentZoom();
		var unita         = this.viewer.pluginGetUnits();
		var mapx          = this.viewer.pluginGetCurrentX();
		var mapy          = this.viewer.pluginGetCurrentY();
		var mapext        = this.viewer.pluginGetMapExtent();
		var mappaTypeCode = this.paramsJS.mappe.mappaList[0].typeCode; //TODO Funziona solo con mappe con unico strato
		var me =  this;
		
		// Definisce formati di stamapa
		var printFormats = [];
		var n = 3;
		var maxPrintFormat = this.paramsJS.mappe.maxPrintFormat;
		if (maxPrintFormat) {
			n = maxPrintFormat.substring(1,2);	
		} 
		for (var i = 4; i >= n; i--) {
			printFormats.push({
		                checked: (i==4 ? true: false),
		                fieldLabel: '',
		                boxLabel: 'A'+i,
		                name: 'formato',
		                inputValue: 'a'+i
		            });
		}
		
		var parametri = [{
			columnWidth: '1',
			labelWidth: 60,
			xtype: 'container',	
	        items: {
	            xtype: 'fieldset',
	            title: 'Personalizza la stampa della mappa',
	            autoHeight: true,
	            items: [{
	            	xtype: 'numberfield',
	                fieldLabel: 'Scala 1',
		            name: 'scala',
		            value: Math.round(scala),
		            allowBlank: false,
		            allowDecimals: false,
		            allowNegative: false
		            /*,
		            minValue: 200,
		            maxValue: 300000
		            */
	            },{
	            	xtype: 'textfield',
			    	fieldLabel: 'Titolo',
			    	anchor: '99%',
			    	name: 'titolo',
			    	value: this.titoloMappa,
			    	allowBlank: false,
			    	maxLength: 100
	            },{
	            	xtype: 'textfield',
			    	fieldLabel: 'Sottotitolo',
			    	anchor: '99%',
			    	name: 'sottotitolo',
			    	value: this.sottotitoloMappa,			    	
			    	maxLength: 500
	            },{
			    	xtype: 'htmleditor',
			    	fieldLabel: 'Descrizione',
			    	height: 100,
			    	anchor: '99%',
			    	name: 'descrizione',
			    	value: this.descrizioneMappa,
			    	enableAlignments: false,
			    	enableFont: false,
			    	enableLinks: false,
			    	enableSourceEdit: false
				},{
		            xtype: 'checkboxgroup',
		            anchor: '99%',
		            fieldLabel: 'Includi',
		            items: [{
                        xtype: 'checkbox',
                        boxLabel: 'Indirizzo URL',
                        name: 'stampaReferer',
                        checked: false
                    },{
                        xtype: 'checkbox',
                        boxLabel: 'Data e ora',
                        name: 'aggDataOra'
		            },{
                        xtype: 'checkbox',
                        id: 'permalinkChk',
                        boxLabel: 'Permalink',
                        name: 'printPermalink',
                        checked: false
		            }]
	            }]
			}
		},{
			columnWidth: '.3',
			xtype: 'container',				
	        items: {
	            xtype: 'fieldset',
	            title: 'Orientamento',
	            height: 100,
	            labelWidth: 10,
	            defaultType: 'radio',
	            items: [{
	                checked: true,
	                fieldLabel: '',
	                boxLabel: 'Verticale',
	                name: 'orientamento',
	                inputValue: 'v'
	            },{
	                fieldLabel: '',
	                labelSeparator: '',
	                boxLabel: 'Orizzontale',
	                name: 'orientamento',
	                inputValue: 'o'
	            }]
			}
		},{
			bodyStyle: 'padding-left:5px;',
			columnWidth: '.3',
			xtype: 'container',	
	        items: {
	            xtype: 'fieldset',
	            title: 'Formato',
	            height: 100,
	            labelWidth: 10,
	            defaultType: 'radio',	            
	            items: printFormats
	            /*[{
	                checked: true,
	                fieldLabel: '',
	                boxLabel: 'A4',
	                name: 'formato',
	                inputValue: 'a4'
	            },{
	                fieldLabel: '',
	                labelSeparator: '',
	                boxLabel: 'A3',
	                name: 'formato',
	                inputValue: 'a3'
	        	},{
	                fieldLabel: '',
	                labelSeparator: '',
	                boxLabel: 'A2',
	                name: 'formato',
	                inputValue: 'a2'
	        	}]*/
			}
		},{
			bodyStyle: 'padding-left:5px;',
			columnWidth: '.4',
			xtype: 'container',	
	        items: {
	        	xtype: 'fieldset',
	            title: 'Qualit&agrave;',
	            //autoHeight: true,
	            //fieldLabel: 'Risoluzione',
		        labelWidth: 60,
	            height: 100,
	            items: [{
		            xtype: 'combo',
		            //width: 150,
		            anchor: '-10',
		            labelSeparator: ':\n',
		            mode: 'local',
		            triggerAction: 'all',
		            forceSelection: true,
		            editable: false,
		            lazyInit: false,
		            value: '96',
		            listConfig: {
		            	getInnerTpl: function() {
	            			return '<div data-qtip="{suggerimento}">{descrizione}</div>'; 
		            		}
	            	},
		            fieldLabel: 'Risoluzione',
		            name: 'dpiStampa',
		            hiddenName: 'dpiStampa',
		            displayField: 'descrizione',
		            valueField: 'valore',
		            store: Ext.create('Ext.data.ArrayStore', {
				        //id: 0,			        
				        fields: ['id', 'valore', 'descrizione', 'suggerimento'],    //suggerimento
					    data: [
					    	[1, '96' , '96 dpi' , 'Risoluzione standard per immagini a video'],
					    	[2, '150', '150 dpi', 'Risoluzione buona per stampa'],
					    	[3, '300', '300 dpi', 'Risoluzione ottima per stampa']
					    ]
				    })
	            }]
            }
		},{
			columnWidth: '1',
			xtype: 'container',	
			items: {
	            xtype: 'fieldset',
	            title: 'Esportazione',
	            autoHeight: true,
	            items: {
		        	xtype: 'radiogroup',
		            columns: 2,
		            items: [
		                {boxLabel: 'PDF',                name: 'esportazione', inputValue: 'pdf', checked: true},
		                {boxLabel: 'Immagine diretta',   name: 'esportazione', inputValue: 'png'},
		                {boxLabel: 'DOCX', name: 'esportazione', inputValue: 'docx'},
		                {boxLabel: 'RTF',                name: 'esportazione', inputValue: 'rtf'},
		                {boxLabel: 'ODT',                name: 'esportazione', inputValue: 'odt'}
		            ]
	            }
			}
	    },
	    	{ xtype: 'hidden', name: 'iehack',            value: String.fromCharCode(153)},
	    	{ xtype: 'hidden', name: '_charset_',         value: ''},
			//{ xtype: 'hidden', name: 'mappaTypeCode',     value: mappaTypeCode},
	    	{ xtype: 'hidden', name: 'mapx',              value: mapx},
	    	{ xtype: 'hidden', name: 'mapy',              value: mapy},
	    	{ xtype: 'hidden', name: 'unita',             value: unita},
			//{ xtype: 'hidden', name: 'urlMappa',          value: escape(unescape(urlMappa))},
			{ xtype: 'hidden', name: 'urlLogo',           value: this.urlLogo},
			{ xtype: 'hidden', name: 'urlLogoSecondario', value: this.urlLogoSecondario},	
			{ xtype: 'hidden', name: 'projectionCode',    value: this.getProjectionCode()},
			{ xtype: 'hidden', name: 'permalinkHref',     value: '', id : 'permalinkHref'}
		];
		
		for (var i=0; i < urlMappa.length; i++ ) {
			
			parametri.push({ xtype: 'hidden', 
							 name: 'urlMappa', 
							 value: escape(unescape(urlMappa[i].url))});
			
			parametri.push({ xtype: 'hidden', 
							name: 'mappaTypeCode', 
							value: urlMappa[i].typeCode});
			
			// TODO gestita solo mappa 0
			var nMappa = 0;
			var lag = this.paramsJS.mapDefinitions[nMappa].whichLayerAggregationContainsNPluginLayer(urlMappa[i].nPluginLayer);
			parametri.push({ xtype: 'hidden', 
							name: 'opacity', 
							value: lag.opacity});
			
			var tileStampaAltezza 	= 0;
			var tileStampaLarghezza = 0;
			
			if (lag!=null && this.TOCPanel && this.TOCPanel.tocInfo!=null) {
				
				var servInfo = this.TOCPanel.tocInfo.getServer(lag.server.id);
				if (servInfo!= null) {
					tileStampaLarghezza = servInfo.tileStampaLarghezza;
					tileStampaAltezza   = servInfo.tileStampaAltezza;
				}
			}
			  
			parametri.push({ xtype: 'hidden', 
				name: 'tileStampaAltezza', 
				value: tileStampaAltezza});

			parametri.push({ xtype: 'hidden', 
				name: 'tileStampaLarghezza', 
				value: tileStampaLarghezza});
			
			var popups = this.viewer.pluginGetOpenedPopups();
			for (var j=0; j < popups.length; j++) {
				var p = popups[j];
				parametri.push({ xtype: 'hidden', 
					name: 'popupxy', 
					value: p.lonlat.lon + "|" + p.lonlat.lat});
				
				parametri.push({ xtype: 'hidden', 
					name: 'popuptext', 
					value: p.contentHTML});
				
			}
			
		}
		
		var fp = Ext.create('Ext.FormPanel', {
			id: 'fp',
	        border: false,
	        frame: true,
	        items: [{
	        	xtype: 'container',	
	        	layout: 'column',
	        	border: false,
	            defaults: {
	                columnWidth: '.5',
	                border: true
	            },            
	            items: parametri
	        }]
	    });

		var printWindow = Ext.create('Ext.Window', {
			id: 'printWindow',
			title: 'Stampa mappa',
			layout: 'fit',
			iconCls: 'iconPrint',
			frame: true,
			border: false,
			maximizable: false,
	//		monitorResize: true,
			plain: true,
			modal: true,
			width: 600,
			height: 520,
			cls: 'clearCSS',
			items: fp, //printWizard
			buttonAlign: 'right',
			buttons: [{
	            text: 'OK',
	            width: 75,
	            handler: function(){
	            	if(fp.getForm().isValid()){
	            		//getForm().
	               		Ext.getCmp('fp').getForm().standardSubmit = true;
	               		//Ext.getCmp('fp').getForm().getEl().dom.acceptCharset = 'utf-8';
	               		//Ext.getCmp('fp').getForm().getEl().dom.target = '_self';
	               		//Ext.getCmp('fp').getForm().getEl().dom.action = server + context + '/StampaMappaServlet';
	               		var submitParams = {
	               					headers: { acceptCharset: 'utf-8' },
	               					target: '_blank',
	               					url: server + context + '/StampaMappaServlet',
	               					paramPreset: me.paramsJS.nomePreset
	               		}
	               		
	               		// Aggiunta parametri WMS da url
						Ext.apply(submitParams, me.paramsJS.urlAdditionalParams);
						
						if(Ext.getCmp('permalinkChk').getValue()){
							Ext.getCmp('permalinkHref').setValue(me.generatePermalink());
						}
	               		
	               		Ext.getCmp('fp').getForm().submit(submitParams);
	            	}
	            }
	        },{
	            text: 'Annulla',
	            width: 75,
	            handler: function(){
					Ext.getCmp('printWindow').close();
				}
	        }]
		}).show();
	},
	
	/**
	 * Method: wmsExplorerWidgetActivate
	 * Attivazione widget di gestione aggiunta WMS
	 * 
	 * @param {} addPointCatIdx
	 * @param {} addPointLayIdx
	 * @param {} bBefore
	 */
	wmsExplorerWidgetActivate: function(addPointCatIdx, addPointLayIdx, bBefore) {
		
		if(this.paramsJS.layOut.WMSExplorer && !this.wmsExplorerWidget){	
		
			var me = this;
			
			this.wmsExplorerWidget = Ext.create('Ext.window.Window',{
				layout: 'fit',
		        closeAction: 'hide',
				title: 'WMS Explorer',
				resizable: true,
				width: 600, 
				height: 400,
				items: [
				        Ext.create('TolomeoExt.ToloWMSExplorerPanel', {
				        		addPointCatIdx: (addPointCatIdx) ? addPointCatIdx : "0",
	 							addPointLayIdx: (addPointLayIdx) ? addPointLayIdx : undefined,
	 							bBefore: bBefore,
	 							listeners: {
	 								'addLayer' : function(layers) {
		 									for (var i=0; i<layers.length; i++) {
		 										var layer = layers[i];
			 									var options = {
															serverurl:  layer.url,
			 												layername: layer.name,
			 												addPointCatIdx: this.addPointCatIdx,
			 												addPointLayIdx: this.addPointLayIdx,
			 												bBefore: this.bBefore
														}
														me.addLayer(options);
		 									}
	 									},
	 								'closePressed': function() {
	 										me.wmsExplorerWidget.hide();	
	 										me.buttonsPanel.buttonToggle(TolomeoExt.ToloAPIOpCodes.btnWMSExplorer, null, true)
	 								}
	 							}
				        	})],
				 listeners: {'hide' : function() {
										me.buttonsPanel.buttonToggle(TolomeoExt.ToloAPIOpCodes.btnWMSExplorer, null, true)
									}
				 			}
			}).show();

		} else{
			if (addPointCatIdx) this.wmsExplorerWidget.addPointCatIdx = addPointCatIdx;
 			if (addPointLayIdx) this.wmsExplorerWidget.addPointLayIdx = addPointLayIdx;
 			if (bBefore) this.wmsExplorerWidget.bBefore = bBefore;
			this.wmsExplorerWidget.show();
		}
		
	},
	
	/**
	 * Disattivazione widget di gestione aggiunta WMS
	 */
	cswWidgetDeactivate : function(){
		if(this.cswWidget){
			this.cswWidget.hide();
		}
	},
	
	/**
	 * Method: wmsExplorerWidgetDeactivate
	 * Chiude il componente di gestione dei Catalog Services.
	 */
	wmsExplorerWidgetDeactivate: function(){
		if(this.wmsExplorerWidget){
			this.wmsExplorerWidget.hide();
		}
	},
	
	/**
	 * Method: cswWidgetActivate
	 * Crea una finestra di gestione dei Catalog Services.
	 *
	 * 
	 */
	cswWidgetActivate : function(addPointCatIdx, addPointLayIdx, bBefore) {
		
		var cswCrsCode = "EPSG:4326";		
		var f = function(){
			
			var cswConfig = this.paramsJS.layOut.csw;
			
			if(!this.cswWidget){			
	
				var toloBBox = BBox.create(this.viewer.pluginGetMapExtent());
				
				var currCrsCode = this.getProjectionCode();
						
				if(currCrsCode != cswCrsCode){
					toloBBox.transform(currCrsCode,cswCrsCode);						
				}
				
				var config = {			
					XDProxy: { url:this.TOLOMEOServer + this.TOLOMEOContext + "/TolomeoProxyServlet", callback: "" },
					//TODO ricorda di mettere a posto. Sembra che se c'e' anche il server http:// non funzioni bene e che parte un options invece di un get
					//XDProxy: { url:"/tolomeobinj/TolomeoProxyServlet", callback: "" },	
					catalogs : cswConfig.catalogList,			   
			     	dcProperty: "title",
				   
				    initialBBox: {
						minx: Math.min(toloBBox.left,toloBBox.right),
						miny: Math.min(toloBBox.bottom,toloBBox.top),
						maxx: Math.max(toloBBox.left,toloBBox.right),
						maxy: Math.max(toloBBox.bottom,toloBBox.top)
					}, 
			
			   		cswVersion: cswConfig.cswVersion,  		  		
					filterVersion: cswConfig.filterVersion,  		
					start: 1,  		
					limit: cswConfig.limit,		
					timeout: cswConfig.timeout
				};
					
				/*
				var i18n = Ext.create('Ext.i18n.Bundle', {
					bundle : "CSWViewer",
					path : this.TOLOMEOServer + this.TOLOMEOStaticRoot + "js/ext/csw/i18n",
					lang : "it-IT"
				});*/
				
				
				var i18n = TolomeoExt.getApplication().bundle;
				
				var me = this;
			
				//i18n.onReady( function() {
				//i18n.on('loaded', function() { 
					
					// Declares a panel for querying CSW catalogs
					var cswPanel = new CSWPanel({
							title: "",
							header: false,
							config: config,
							region:'center',
							i18n: i18n,
							addPointCatIdx: (addPointCatIdx) ? addPointCatIdx : "0",
	 						addPointLayIdx: (addPointLayIdx) ? addPointLayIdx : undefined,
	 						bBefore: bBefore,
							listeners: {
								'zoomToExtent': function(el){
										
										// il bound ritornato da geonetwork ha left e right invertito, per evitare problemi...
										var b = {
											left: Math.min(el.bbox.left, el.bbox.right),
											bottom: Math.min(el.bbox.bottom, el.bbox.top),
											right: Math.max(el.bbox.left, el.bbox.right),
											top: Math.max(el.bbox.bottom, el.bbox.top)
										};
									
										var toloBBox = BBox.create(b);
										var currCrsCode = me.getProjectionCode();					
										if(currCrsCode != cswCrsCode){
											toloBBox.transform(cswCrsCode,currCrsCode);						
										}
										me.zoomToExtent(toloBBox,null);
									},
							
								'viewMap': function(el){
									// addPointCatIdx, addPointLayIdx, bBefore
									if(el.layers){
										for(var l=0; l < el.layers.length; l++ ){
											var layer = el.layers[l];
											if(layer.wms){
												var options = {
													serverurl:  layer.wms,
	 												layername: layer.layer,
	 												addPointCatIdx: this.addPointCatIdx,
	 												addPointLayIdx: this.addPointLayIdx,
	 												bBefore: this.bBefore
												}
												me.addLayer(options);
												/*
												var mappa = {
													mapOptions : "layers: '" + layer.layer + "'",
													overlay : false,
													SRID : me.getProjectionCode(),
													units : 'm',
													mostraInLegenda : true,
													viewerOptions : "",
													typeCode : 11,		// WMS
													nome : layer.description,
													url : layer.wms
												};
												me.addLayer(mappa);
												*/
											}
										}
									}
								},
							
								'beforesearch' : function(params){
									if(!(params.useAdvancedSearch && params.useBbox)) return;
							
									var toloBBox = BBox.create(me.viewer.pluginGetMapExtent());					
									var currCrsCode = me.getProjectionCode();
									
									if(currCrsCode != cswCrsCode){
										toloBBox.transform(currCrsCode,cswCrsCode);						
									}
									
									var cswBBox = {									
										minx: Math.min(toloBBox.left,toloBBox.right),
										miny: Math.min(toloBBox.bottom,toloBBox.top),
										maxx: Math.max(toloBBox.left,toloBBox.right),
										maxy: Math.max(toloBBox.bottom,toloBBox.top)
									}
									
									this.setBBox(cswBBox);
								}
						}
							
					});
			
					cswPanel.mon(this.TOCPanel, 'itemSelected', function(catTreeIdx, layTreeIdx, classi) {
														cswPanel.addPointCatIdx = catTreeIdx;
									 					cswPanel.addPointLayIdx = (layTreeIdx) ? layTreeIdx : undefined;
													});
													
					me.cswWidget = Ext.create('Ext.Window', {
						id: 'cswWindow',
						title: 'Catalogue Services',
						layout: 'fit',
						iconCls: 'iconCsw',
						frame: true,
						border: false,
						maximizable: false,
						minimizable: false,
				//		monitorResize: true,
						plain: true,
						width : 620,				
						boxMaxHeight:562,
						boxMinWidth: 600,
		            	autoScroll: true,
		            	closeAction: 'hide',
						cls: 'clearCSS',
						cswPanel: cswPanel, 
						items: [cswPanel],
						listeners : {
							'hide' : function() {
								me.buttonsPanel.buttonToggle(TolomeoExt.ToloAPIOpCodes.btnCsw, null, true)
							}
						}
					});
										
					me.cswWidget.show();
			//	});
			}else{
				if (addPointCatIdx) this.cswWidget.cswPanel.addPointCatIdx = addPointCatIdx;
	 			if (addPointLayIdx) this.cswWidget.cswPanel.addPointLayIdx = addPointLayIdx;
	 			if (bBefore) this.cswWidget.cswPanel.bBefore = bBefore;
				this.cswWidget.show();
			}
		}
		
		this.lazyLoadScript(['proj4js', 'cswExplorer'],
			f,
			function(){Ext.Msg.alert('Attenzione', 'Problema nel caricamento delle librerie necessarie.', function(){this.buttonsPanel.buttonToggle(TolomeoExt.ToloAPIOpCodes.btnCsw, null, true);}, this);},
			this
		);
					
	},
	
	/**
	 * Aggiunge un layer nella posizione indicata dai parametri.
	 * 
	 * @param {} options oggetto contenente le opzioni nei seguenti attributi <br />
	 * 		<ul>
	 * 			<li>serverurl: url del server WMS</li>
	 * 			<li>layername: nome del layer WMS</li>
	 * 			<li>addPointCatIdx: Indice della categoria nella quale viene aggiunto il layer </li>
	 * 	 		<li>addPointLayIdx: Indice layer prima o dopo del quale aggiungere il nuovo layer</li>
	 * 			<li>bBefore: indica se aggiungere prima o dopo</li>
	 * 		</ul>
	 * 			
	 */
	addLayer: function (options) {
		
		if (this.TOCPanel) {
			this.TOCPanel.addLayer(options);
		}
		
	},
	
	/**
	 * Method: setCurrentSelectLayer
	 * Setta il layer corrente (codTPN). 
	 *
	 * Parameters:
	 * layer - {} il layer.
	 */
	setCurrentSelectLayer: function (layer) {
		this.currentSelectedLayer = layer;
		this.togglePermittedOperations();
		this.fireEvent('onOperationPressDefault', 2);
	},
	
	/**
	 * Method: getCurrentSelectLayer
	 * 
	 * Returns:
	 * Ritorna l'oggetto ParametriEventiLayer relativo al layer scelto in combobox selectLayerChoose
	 */
	getCurrentSelectLayer: function () {
		if ((this.paramsJS.azioniApertura.modoEditingSingolo == null) ||(this.paramsJS.azioniApertura.modoEditingSingolo == ""))  {
			if(this.currentSelectedLayer==null) return null;
			return this.paramsJS.getParamJSLayer(this.currentSelectedLayer);
		} else {
			var ret = this.paramsJS.getParamJSLayer(this.paramsJS.azioniApertura.modoEditingSingolo.layerCODTPN);
			if (ret) return ret;
		}
		// non dovrebbe arrivare fino a qua a meno che non sia modoEditSingolo ed il corrispondente layer non ha azioni definite
		alert('Errore nella configurazione. EditModoSingolo attivo su layer ' + this.paramsJS.azioniApertura.modoEditingSingolo.layerCODTPN + 'ma layer non presente nella lista di azionieventi');
		return null;
	},
			
	/**
	 * Method: onAnnullaSelezioni
	 * 
	 */
	onAnnullaSelezioni: function() {
		this.clearSelected(true);
		this.clearHighLigthed(true);
	},

	/**
	 * Method: onIdentify
	 * Esegue identify dell'oggetto correntemente selezionato, invocando la doEventActions con gli appositi parametri
	 */
	onIdentify: function () {	
		var azSelLayer = this.getCurrentSelectLayer();
		this.identify(azSelLayer);
		/*
		this.geoOpToPostVar(this.operationIdentify);
		this.geometryToPostVar ("");
		//ALE1
		// suppongo che un elemento del giusto layer sua selezionato altrimenti non sarebbe attivo il pulsante
		if(this.selezioneCorrente.getByCodTPN(azSelLayer.codTPN)){
			this.doEventActions(azSelLayer, this.eventVis,  this.selezioneCorrente.getByCodTPN(azSelLayer.codTPN).geometries[0].key);
			if (azSelLayer.chiudiSuDblClick) {
				close();
			}
		}
		*/
	},
	
	identify: function (layer){
		this.geoOpToPostVar(this.operationIdentify);
		this.geometryToPostVar ("");

		if(this.selezioneCorrente.getByCodTPN(layer.codTPN)){
			var selCorrente = this.selezioneCorrente.getByCodTPN(layer.codTPN).geometries[0];
			this.doEventActions(layer, this.eventVis,  selCorrente.key, undefined, undefined, undefined, selCorrente);
			
			if (layer.chiudiSuDblClick) {
				close();
			}
		}
	},

	/**
	 * Method: onCustomButtonPress
	 *
	 * Parameters:
	 * btn - {} il pulsante premuto.
	 */
	onCustomButtonPress: function (btn) {	
	
		//paramsJS.azioniEventi.eventiLayerList[layerPos].azioniEventiRicercaList.ricercaList[ricercaPos]
		var idBtn = btn.idCustomButton;
	
		//var cb = this.paramsJS.layOut.customButtonList[idBtn];
		if (((typeof(btn.pressFunction)=="undefined"))||(btn.pressFunction == '')) {
			var currLayer = this.getCurrentSelectLayer();
			
			if (currLayer!=null) { 
				this.geoOpToPostVar("");
				this.geometryToPostVar ("");
				var selCorrente = this.selezioneCorrente.getByCodTPN(currLayer.codTPN);
				var key = selCorrente != null ? selCorrente.geometries[0].key : null;
				this.doEventActions(currLayer, this.eventCustomButton, key, null, null, idBtn, undefined, undefined, selCorrente);
			} else {
				alert("Nessun layer selezionato");
			}
		} else {
			(new Function(btn.pressFunction)).call(this);
			//btn.pressFunction();			
		}
		
	},
	
	/**
	 * Method: onCustomButtonRelease
	 *
	 * Parameters:
	 * btn - {} il pulsante rilasciato.
	 */
	onCustomButtonRelease: function (btn) {	
		//paramsJS.azioniEventi.eventiLayerList[layerPos].azioniEventiRicercaList.ricercaList[ricercaPos]
		//var idBtn = btn.idCustomButton;
	
		//var cb = this.paramsJS.layOut.customButtonList[idBtn];
		if (((typeof(btn.releaseFunction)=="undefined"))||(btn.releaseFunction == '')) {
		//if (((btn.releaseFunction == null)||(btn.releaseFunction == ''))) {
				
		} else {
			(new Function(btn.releaseFunction)).call(this);
			//btn.releaseFunction();			
		}		
	},
	
	/**
	 * Method: onDigitizeStart
	 * Funzione per l'inizio della digitalizzazione.
	 *
	 * Parameters:
	 * digitizeOperation - {String} tipo di digitalizzazione richiesta (vedere costanti all'inizio della pagina paer valori possibili).
	 */
	onDigitizeStart: function (digitizeOperation) {
		
		this.currentDigitizeOperation = digitizeOperation;
		switch (digitizeOperation) {
	   		case this.digitizeOperationInsert:
	   			this.onDigitizeStartInsert();
	   		break;
	   		case this.digitizeOperationSubtract:
	   			this.onDigitizeStartSubtract();
	   		break;
	   		case this.digitizeOperationAdd:
	   			this.onDigitizeStartAdd();
	   		break;
	   		case this.digitizeOperationAddSub:
	   			this.onDigitizeStartAddSub();
	   		break;
	   		case this.digitizeOperationVertexEdit:
	   			this.onDigitizeStartVertexEdit();
	   		break;
	   		case this.digitizeOperationDragDrop:
	   			this.onDigitizeStartDragDrop();
	   		break;
	   	}
	},
		
	/**
	 * Method: onDigitizeStop
	 * Funzione per l'interruzione (annullamento) della digitalizzazione.
	 *
	 * Parameters:
	 * digitizeOperation - {String} digitizeOperation, tipo di digitalizzazione richiesta (vedere costanti all'inizio della pagina paer valori possibili).
	 */
	onDigitizeStop: function (digitizeOperation) {

		this.currentDigitizeOperation = digitizeOperation;
		switch (digitizeOperation) {
	   		case this.digitizeOperationInsert:
	   			this.onDigitizeStopInsert();
	   		break;
	   		case this.digitizeOperationSubtract:
	   			this.onDigitizeStopSubtract();
	   		break;
	   		case this.digitizeOperationAdd:
	   			this.onDigitizeStopAdd();
	   		break;
	   		case this.digitizeOperationAddSub:
	   			this.onDigitizeStopAddSub();
	   		break;
	   		case this.digitizeOperationVertexEdit:
	   			this.onDigitizeStopVertexEdit();
	   		break;
	   		case this.digitizeOperationDragDrop:
	   			this.onDigitizeStopDragDrop();
	   		break;
	   	}
	},
	
	/**
	 * Method: onDigitizeByCADStart
	 * Funzione per l'inizio della digitalizzazione per mezzo del CAD
	 *
	 * Parameters:
	 * digitizeOperation - {String} tipo di digitalizzazione richiesta (vedere costanti all'inizio della pagina paer valori possibili).
	 */
	onDigitizeByCADStart: function (digitizeOperation) {
		
		this.currentDigitizeOperation = digitizeOperation;
		switch (digitizeOperation) {
	   		case this.digitizeOperationInsert:
	   			this.onDigitizeByCADStartInsert();
	   		break;	   		
	   	}
	},
	
	/**
	 * Method: onDigitizeByCADStop
	 * Funzione per l'interruzione (annullamento) della digitalizzazione inizia per mezzo del CAD
	 *
	 * Parameters:
	 * digitizeOperation - {String} digitizeOperation, tipo di digitalizzazione richiesta (vedere costanti all'inizio della pagina paer valori possibili).
	 */
	onDigitizeByCADStop: function (digitizeOperation) {

		this.currentDigitizeOperation = digitizeOperation;
		switch (digitizeOperation) {
	   		case this.digitizeOperationInsert:
	   			this.onDigitizeByCADStopInsert();
	   		break;	   		
	   	}
	},

	/**
	 * Method: onUpdateAlfa
	 * Funzione chiamata alla fine della modifica alfanumerica. Innesca l'esecuzione delle azioni collegate a tale evento
	 */
	onUpdateAlfa: function () {
		var modLayer = this.getCurrentSelectLayer();
		this.geoOpToPostVar(this.operationUpdateAlfa);
		this.geometryToPostVar ("");
		//ALE1
		// suppongo che un elemento del giusto layer sua selezionato altrimenti non sarebbe attivo il pulsante
		var selCorrente = this.selezioneCorrente.getByCodTPN(modLayer.codTPN).geometries[0];
		this.doEventActions(modLayer, this.eventUpdateAlpha,  selCorrente.key, undefined, undefined, undefined, selCorrente);        
		this.clearSelected(modLayer.codTPN);
	},

	/**
	 * Method: onDelete
	 * Funzione chiamata per la cancellazione di un oggetto. Innesca l'esecuzione delle azioni collegate a tale evento. 
	 * Nel file xml l'azione vuota (default) provvede alla cancellazione dell'oggetto.
	 */
	onDelete: function () {
		var cancLayer = this.getCurrentSelectLayer();

		this.geoOpToPostVar(this.operationFeatureDelete);
		this.geometryToPostVar ("");
		//ALE1
		// suppongo che un elemento del giusto layer sua selezionato altrimenti non sarebbe attivo il pulsante
		var selCorrente = this.selezioneCorrente.getByCodTPN(cancLayer.codTPN).geometries[0];
		
		this.doEventActions(cancLayer, this.eventCanc,  selCorrente.key, undefined, undefined, undefined, selCorrente);
		
		var azioniEventi = this.getAzioniEventi(cancLayer,this.eventCanc, false);
		var redraw = true
		if(azioniEventi){
			redraw = azioniEventi.refreshAtTheEnd;
		}
		this.clearSelected(redraw, cancLayer.codTPN);
	},

	/**
	 * Method: onSelectLayerChange
	 * Funzione invocata ad ogni cambio del layer selezionato per le operazioni di editing. Provvede a chiamare le funzioni necessarie per aggiornare lo stato del sistema a questa nuova situazione
	 */
	// Chiamata da JSP quando viene cambiato il layer sul quale si vuole fare la selezione
	onSelectLayerChange: function () {
		// Modifica di conseguenza le operazioni possibili (icone)
		this.togglePermittedOperations();
	},

	// Funzioni che devono essere chiamate dal plugin alla fine della digitalizzazione

	/**
	 * Method: onDigitizeEndVertexEditing
	 * Funzione richiamata dal viewer alla fine dell'editing vertici 
	 *
	 * Parameters:
	 * geometry - {} la geometria.
	 */
	onDigitizeEndVertexEditing: function (geometry) {
		this.onDigitizeEndGeometry(geometry);
	},

	/**
	 * Method: onDigitizeEndDragDrop
	 * Funzione richiamata dal viewer alla fine del drag-drop 
	 *
	 * Parameters:
	 * geometry - {} la geometria.
	 */
	onDigitizeEndDragDrop: function (geometry) {
		this.onDigitizeEndGeometry(geometry);
	},

	/**
	 * Method: onDigitizeEndPolygon
	 * Funzione richiamata dal viewer alla fine della digitalizzazione di un poligono
	 *
	 * Parameters:
	 * geometry - {JSGeometry} la geometria.
	 */
	onDigitizeEndPolygon: function (geometry) {
		this.onDigitizeEndGeometry(geometry);
	},

	/**
	 * Method: onDigitizeEndCircle
	 * Funzione richiamata dal viewer alla fine della digitalizzazione di un cerchio
	 *
	 * Parameters:
	 * geometry - {JSGeometry} il centro.
	 * radius - {} il raggio.
	 */
	onDigitizeEndCircle: function (center, radius) {},

	/**
	 * Method: onDigitizeEndLine
	 * Funzione richiamata dal viewer alla fine della digitalizzazione di una linea
	 *
	 * Parameters:
	 * geometry - {JSGeometry} la geometria.
	 */
	onDigitizeEndLine: function (geometry) {
		this.onDigitizeEndGeometry(geometry);
	},

	/**
	 * Method: onDigitizeEndPoint
	 * Funzione richiamata dal viewer alla fine della digitalizzazione di un punto
	 *
	 * Parameters:
	 * geometry - {JSGeometry} la geometria.
	 */
	onDigitizeEndPoint: function (geometry) {
		
		this.onDigitizeEndGeometry(geometry);
	},

	/**
	 * Method: onMappaViewChanged
	 * Funzione richiamata dal viewer quando la visualizzazione cambia per quanche motivo
	 */
	onMappaViewChanged: function () {
		this.smallMapSetPosition();
	},

	/**
	 * Method: onMappaSelect
	 * Funzione che il viewer deve chiamare quando in modalit� selezione e 
	 * viene fatto click sulla mappa	
	 *
	 * Parameters:
	 * point - {Point} point, Punto clickato sulla mappa (in coordinate).
	 * X - mapXPixel del punto clickato in pixel
	 * Y - mapYPixel del punto clickato in pixel
	 */
	onMappaSelect: function (point,selectionMode,addToSelected, visualize, mapXPixel, mapYPixel) {

		// TODO supportata solo mappa 0
		var mappa = this.paramsJS.mappe.mappaList[0];
		var codTPN;
		var additionalWMSLayers = [];
		
		// Se � impostata una modalit� di selezione controllo legenda e/o lista layers interrogabili
		if(selectionMode){
			// Se c'� la legenda l'impilamento dipende dai layer visibili su di essa
			if(this.TOCPanel){
						
				var visibleLayers = this.TOCPanel.getVisibleLayers();
				var queryableLayers = [];
						
				for(var i=0; i<visibleLayers.length; i++){
					var visibleLayer = visibleLayers[i];
					if (this.paramsJS.isSelectable(visibleLayer.codTPN)){
						if(queryableLayers.indexOf(visibleLayer.codTPN)==-1){
							queryableLayers.push(visibleLayer.codTPN);
						}
					}
				}
				
				// Aggiunta di eventuali layer aggiunti dall'utente
				var userWMSList = this.TOCPanel.getVisibleUserWMSList();
				for (var i=0; i< userWMSList.length; i++) {
					var idxObj = userWMSList[i]; 
					var currCat = this.TOCPanel.tocInfo.getCategoryInfo(idxObj.catTreeIdx);
					var currLayer =  currCat.layers[idxObj.layTreeIdx];
					if (currLayer.serverID)
					//var server = this.TOCPanel.tocInfo.getServer(currLayer.serverID);
					
					if (currLayer.queryable) {
						var currUrl = (currLayer.url) ? currLayer.url : this.paramsJS.getServer(currLayer.serverID, mappa).url;
						//var infoformat ="application/vnd.ogc.gml";
						var formats = currLayer.getFeatureInfoFormats;
						var infoformat = "";
						for (var i=0; i < formats.length; i++ ) {
							var currFormat = formats[i];
							if (currFormat.indexOf("gml") != -1) {
								infoformat = currFormat;
								if (infoformat == "text/gml") {
									break;
								}
							}
						}
						
						if (infoformat != "") {
							// Workaround per evitare che venga preso versione GML3
							// Andrebbe gestito meglio, rendendo anche la parte server in grado di gestire le versioni gml successive alla 2
							// nella classe GetFeatureInfoLayer del package sit
							if (infoformat.indexOf("application/vnd.ogc.gml") != -1) {
								infoformat = "application/vnd.ogc.gml";
							}
							var entry = {
									url: currUrl,
									wmsname: currLayer.name,
									codTPN: currLayer.codTPN,
									descrizione: currLayer.descr,
									infoformat: infoformat
								}	
								additionalWMSLayers.push(entry);	
						}
					}
						
				}
				
				if(additionalWMSLayers.length==0 && queryableLayers.length == 0){
					Ext.Msg.alert('Attenzione', 'Non ci sono layer attualmente selezionabili.<br>Controllare che in legenda i layer siano visibili.');
					this.ajaxQuerySelectOK(null);
					return;
				}			
				codTPN = queryableLayers.join(",");
				
			} else {
				codTPN = this.paramsJS.getSelectableCodTPN().join(",");
			}
		} else {
			codTPN = this.getCurrentSelectLayer().codTPN;
		}
		
		// raggio di tolleranza 6 pixel
		var tolleranceRange = this.viewer.pluginGetResolution() * 6;
			
		var bounds = this.viewer.pluginGetMapExtent();
		
		// TODO scope		
		// Chiamata Ajax per effettuare l'intersezione e ricevere l'oggetto selezionato
		var ajaxOptions = { method: 'post',
			url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxSpatialQueryServlet',
			params: {
				dtInizioFiltro: this.temporalFilterDtInizio,
				dtFineFiltro: this.temporalFilterDtFine,
				coordX: point.x, 
				coordY: point.y,
				codTPN: codTPN,
				range: tolleranceRange,
				SRID: this.paramsJS.mappe.SRID,
				format: 'ext',
				selectionMode: selectionMode,
				//Parametri aggiunti per GetFeatureInfo
				bbox:  bounds.left+","+bounds.bottom+","+bounds.right+","+bounds.top ,
				mapwidth:  this.viewer.pluginGetMapWidth()  ,
				mapheight: this.viewer.pluginGetMapViewerHeight() ,
				X: mapXPixel,
				Y: mapYPixel,
				additionalWMSLayers: (additionalWMSLayers && additionalWMSLayers.length > 0) ? Ext.JSON.encode(additionalWMSLayers) : undefined,
				paramPreset: this.paramsJS.nomePreset
			},
			success: function(results, store){this.ajaxQuerySelectOK(results, store, addToSelected, visualize);},
			failure: function(transport){
				this.fireEvent('selectRequestEnd',{
					ok:false,
					nResults:0,
					errText:transport.responseText?transport.responseText:""+transport
				});
				this.showAjaxError(transport);
			}, 
			scope: this
		}
		
		// Aggiunta parametri WMS da url
		Ext.apply(ajaxOptions.params, this.paramsJS.urlAdditionalParams);
				
		if(this.fireEvent('selectRequestBeforeStart')){
			new TolomeoExt.ToloCrossAjax().request(ajaxOptions);
			this.fireEvent('selectRequestStart');
		}
		this.onBusy(true);
	},	

	/**
	 * Method: ajaxQuerySelectOK
	 * Funzione di callback per la chiamata ajax onMappaSelect {link #onMappaSelect} che identifica gli oggetti presenti in una certa posizione
	 *
	 * Parameters:
	 * results - {} il risultato della richiesta.
	 * store - {} lo store dei dati.
	 */
	ajaxQuerySelectOK: function (results, store, addToSelected, visualize) {
		
		if(results){		
			var geoms = new JSGeometryArray();
			geoms.FromStore(results, store);			
			
			if (geoms.geometries.length==0) {
				this.clearSelected();
			} else {
				this.addSelected(geoms, addToSelected, visualize);	
			}
		} 
		
		this.fireEvent('selectRequestEnd',{
			ok:true,
			nResults:results?geoms.geometries.length:0,
			errText:null
		});		
		
		this.onBusy(false);	
		
		//this.fireEvent('onObjectSelect', geoms);				
		/*
		var selLayer = this.getCurrentSelectLayer();
		if (selLayer.azioniEventiVis.autoVisOnSelect) {
			this.onIdentify();
		}
		*/
	
	    this.fireEvent('onOperationPressDefault', 2);
	},

	/**
	 * Method: showAjaxError
	 * Visualizza messaggio di errore in caso di errore Ajax
	 *
	 * Parameters:
	 * transport - {} transport, risposta della chiamata ajax.
	 * store - {} store.
	 */
	showAjaxError: function (transport) {
		this.onBusy(false);
		if(transport.responseText){
			alert(transport.responseText);
		}else{
			alert(transport);
		}
	},

	// sarebbero da gestire come metodi un oggetto mappa
	//TODO
	//Funzioni di busy

	/**
	 * Property: mapBusy
	 * {Number} 
	 */
	mapBusy: 0,
	
	/**
	 * Method: isBusy
	 * 
	 * Returns:
	 * {Boolean}
	 */
	isBusy: function () { return this.mapBusy != 0; },
	
	/**
	 * Method: onBusy
	 *
	 * Parameters:
	 * areYouBusy - {} areYouBusy.
	 */
	onBusy: function (areYouBusy){
		/* TODO
		if(areYouBusy){
			this.mapBusy++;
			this.refreshBusy();
			//if (this.myMask) this.myMask.show();
		}else{
			this.mapBusy--;
			if(!this.isBusy()){
				this.refreshBusy();
				//if (this.myMask) this.myMask.hide();
			}
		}
		*/
	},
		
	/**
	 * Method: noneBusy
	 * 
	 */
	noneBusy: function (){
		/* TODO
		this.mapBusy = 0;
		if (this.myMask) this.myMask.hide();
		*/
	},
	
	/**
	 * Method: refreshBusy
	 * 
	 */
	refreshBusy: function() {
		/* TODO
		if (this.myMask) 
		if (this.mapBusy) this.myMask.show();
		else this.myMask.hide();
		*/
	},
	
	/**
	 * Method: onScaleChange
	 * Chiamato dal plugin ogni volta che cambia il livello di zoom
	 */
	onScaleChange: function () {
		updateTocScale(this.viewer.pluginGetCurrentZoom());
		updateZoomToScale(this.viewer.pluginGetCurrentZoom());
	},

	/**
	 * Method: addHighlighted
	 * Sulla mappa e' possibile evidenziare degli oggetti. Questo e' utile, per esempio, nelle ricerche, per mostrare quale e' l'oggetto trovato.
	 * Questa funzione consente di evidenziare l'oggetto, di aggiornare di conseguenza la mappa e di fare le altre azioni necessarie.
	 * L'attuale implementazione prevede che un solo oggetto possa essere evidenziato, quindi ogni nuovo va a sostituirsi a quello eventualmente presente.
	 *
	 * Parameters:
	 * geoms - {JSGeometryArray o JSGeometry} oggetto da evidenziare se passato un JSGeometryArray viene utilizzato il primo.
	 * bMulti - {boolean} se non definito o false non � consentita la presenza di pi� di un oggetto, se True � consentita.
	 */
	addHighlighted: function addHighlighted(geoms, bMulti) {
		var geom;
		
		if (!bMulti) this.evidenziazioneCorrente.clear();
		
		this.evidenziazioneCorrente.add(geoms);
		
		//accendo il layer sul quale eseguo l'highlighted nel caso fosse spento in legenda...
		var codTPN = this.evidenziazioneCorrente.geometries[this.evidenziazioneCorrente.geometries.length-1].codTPN;
		if (codTPN!=null && this.TOCPanel) {
			this.TOCPanel.setLayerVisibility(codTPN);
		}
		
		if (this.viewer!=null)
			this.viewer.pluginAddHighlighted(this.evidenziazioneCorrente, bMulti);
			
		/* Vecchia versione monooggetto
		if(geoms instanceof JSGeometryArray){
			this.evidenziazioneCorrente = geoms.geometries[0];
		}else if(geoms instanceof JSGeometry){
			this.evidenziazioneCorrente = geoms;
		}else{
			alert("tipo sconosciuto " + geoms);
			return;
		}
		
		if (this.viewer!=null)
			this.viewer.pluginAddHighlighted(this.evidenziazioneCorrente);*/
	},

	/**
	 * Method: clearHighLigthed
	 * Svuota la evidenziazione corrente, 
	 * deselezionando gli oggetti dalla mappa ed effettuando il resto delle operazioni necessarie (come l'aggiornamento delle operazioni di editing, interrogazione etc. possibili)
	 *
	 * Parameters:
	 * bRedraw - {boolean} Se non definito o false non � consentita la presenza di pi� di un oggetto, se True � consentita.
	 */
	clearHighLigthed: function (bRedraw) {
	
		this.evidenziazioneCorrente.clear();
		if (this.viewer.pluginClearHighlighted(bRedraw)) this.viewer.pluginRefreshMap();
		
		/* Vecchia versione monooggetto
		this.evidenziazioneCorrente = null;
		if (this.viewer.pluginClearHighlighted(bRedraw)) this.viewer.pluginRefreshMap();
		*/
	},

	/**
	 * Method: encodeToggleGroup
	 *
	 * Parameters:
	 * geoms - {JSGeometryArray o JSGeometry} Oggetto da evidenziare, se passato un JSGeometryArray viene utilizzato il primo.
	 */
	addAutoidentified: function (geoms) {
		if(geoms instanceof JSGeometryArray){
			this.autoIdentifyCorrente = geoms;
		}else if(geoms instanceof JSGeometry){
			this.autoIdentifyCorrente = geoms.add(geoms);
		}else{
			alert("tipo sconosciuto " + geoms);
			return;
		}
		this.viewer.pluginAddAutoidentified(this.autoIdentifyCorrente);
	},

	/**
	 * Method: clearAutoidentified
	 * Svuota la evidenziazione corrente, deselezionando gli oggetti dalla mappa ed effettuando il resto delle operazioni necessarie (come l'aggiornamento delle operazioni di editing, interrogazione etc. possibili)
	 *
	 * Parameters:
	 * bRedraw - {boolean} bRedraw
	 */
	clearAutoidentified: function (bRedraw) {
	
		this.autoIdentifyCorrente = null;
		if (this.viewer.pluginClearAutoidentified(bRedraw)) this.viewer.pluginRefreshMap();
	},

	/**
	 * Method: addSelected
	 * Sulla mappa e' possibile selezionare degli oggetti per sottoporli ad editing, interrogazione o altro. Le operazioni possibili sono controllate da configurazione.
	 * Questa funzione consente di selezionare l'oggetto, di aggiornare di conseguenza la mappa e di fare le altre azioni necessarie.
	 * L'attuale implementazione prevede che un solo oggetto possa essere evidenziato, quindi ogni nuovo va a sostituirsi a quello eventualmente presente.
	 *
	 * Parameters:
	 * geoms - {JSGeometryArray o JSGeometry} Oggetto da evidenziare, se passato un JSGeometryArray viene attivata una combobox sull'interfaccia grafica per permettere di scegliere.
	 *  bClearUrl - Indica se resettare l'eventuale pagina di identify 
	 * Quando la scelta � stata fatta viene chiamata la funzione onSelectedFromChoice()
	 */
	addSelected: function (geoms, addToSelected, visualize, bClearUrl) {
		
		var jsGeoArr;
		
		if(geoms instanceof JSGeometry){
			jsGeoArr = new JSGeometryArray();
			jsGeoArr.add(geoms); 
		}else{
			jsGeoArr = geoms;
		}
						
		if (jsGeoArr.geometries.length==1) {
			
			if(!addToSelected){
				this.clearSelected(false, undefined, bClearUrl);
			}else if (this.selezioneCorrente.ContainsCodTPN(jsGeoArr.geometries[0].codTPN)) {			
			// In ogni momento e' possibile che ci sia un solo oggetto selezionato per ogni codTPN
			// Questo vincolo e' stato messo per semplificare l'utilizzo
			// Verifica se gi� presente un oggetto dello stesso codTPN
				// lo cancella
				this.clearSelected(false, jsGeoArr.geometries[0].codTPN, bClearUrl);
			}
			
			//ALE1 selezioneCorrente = jsGeoArr.geometries[0];
			this.selezioneCorrente.add(jsGeoArr.geometries[0]);
			this.viewer.pluginAddSelected(jsGeoArr.geometries[0]);
			
			this.applyCustomQuery();
								
			if(this.paramsJS.isSelectable(jsGeoArr.geometries[0].codTPN)){
				this.setCurrentSelectLayer(jsGeoArr.geometries[0].codTPN);
			}
			this.fireEvent('onObjectSelect', geoms);
			
			var selLayer = this.getCurrentSelectLayer();
			if (selLayer && selLayer.azioniEventiVis && (selLayer.azioniEventiVis.autoVisOnSelect || visualize)) {
				this.onIdentify();
			}
			
		} else if (jsGeoArr.geometries.length>1) {
			
			var dataArray = [];
			
			var descrizioneLayer = null;
			var currentCodTPN = null;
			var z_index = 1000;
			for(var i=0; i<jsGeoArr.geometries.length;i++){
				var jsG = jsGeoArr.geometries[i];
				if(!currentCodTPN || currentCodTPN!=jsG.codTPN){
					descrizioneLayer = this.paramsJS.getParamJSLayer(jsG.codTPN).descrizioneLayer;
					z_index++;
				}
				dataArray.push([z_index+descrizioneLayer,jsG.codTPN,jsG.description,jsG]);
				currentCodTPN = jsG.codTPN;
			}
			
		    var store = Ext.create('Ext.data.ArrayStore',{
		    		fields: [
				       {name: 'z_index'},
				       {name: 'codTPN'},
				       {name: 'objectDescription'},
				       {name: 'jsGeometry'}
				    ], 
		            data: dataArray,
		            sorters:[{property: 'objectDescription', direction: "ASC"}],
		            groupField:'z_index'
		        });
		    
		    var listView = Ext.create('Ext.grid.Panel',{ 
		        store: store, 
		        features: [{ftype:'grouping', groupHeaderTpl: ['{name:this.formatName}',
														        {
														            formatName: function(name) {
														                return name.substr(4);
														            }
														        }]}],
		        emptyText: 'Nessun oggetto selezionabile', 
		        startCollapsed : false, 
		      
		        columns: [		        	
		        	{text: 'Descrizione oggetto',dataIndex:'objectDescription',flex: 1, menuDisabled: true, sortable: false},
		        	{text: 'Layer',dataIndex:'layerDescription', hidden: true, menuDisabled: true, width:0}
		        	
		        ],
		        listeners: {
					itemmouseenter: {
						fn: function (dv, index, node, e) {
        					var record = dv.getRecord( node ).data;
        					this.onChangeFromChoice(record.jsGeometry);
        					return true;
        				},
        			  	scope: this
					},
					itemmouseleave: {
						fn: function (dv, index, node, e) {
							var record = dv.getRecord( node ).data;
							this.clearHighLigthed();
							return true;
						},
						scope: this
					},
					itemclick: {
						fn: function (dv, index, node, e) {
							var record = dv.getRecord( node ).data;
							var selected = record.jsGeometry;
							
							selected.relatedGeoms = jsGeoArr.getByCodTPN(selected.codTPN);
							this.onSelectedFromChoice(selected,addToSelected,visualize);
							return true;
						},
					  	scope: this
					}
				}
			});	    	
		    		    
			if(this.selectedChoiceWindow){
				this.selectedChoiceWindow.close();
			} 
			
			this.selectedChoiceWindow = Ext.create('Ext.Window', {
				title: "Scegli l\'oggetto da selezionare",
				x: 50,
				width: 350,
				height: 300,
				layout:'fit',
				autoScroll: true,
				constrain: true,
				bodyStyle: 'background-color:white',
				items: [listView]
			}).show();
		}
	},
	
	/**
	 * Method: queryingById
	 * Fa un interrogazione ajax al server per recuperare la geometria dell'oggetto.
	 * Come parametri per l'interrogazione utilizza il codTPN e l'IDTPN ed accetta 
	 * come, parametri ulteriori, le funzioni da richiamare in caso di successo o di
	 * fallimento. Se IDTPN � un array verranno cercati tutti gli ID contenuti
	 *
	 * Parameters:
	 * codTPN - {String} codTPN
	 * IDTPN - {String or Array} IDTPN
	 * onSuccess - {Function} onSuccess
	 * onFailure - {Function} onFailure
	 * scope - {Object} contesto delle chiamate di callback
	 */
	queryingById: function(codTPN, IDTPN, onSuccess, onFailure, scope){
		/** {String} */
		var ids = "";
		if (IDTPN instanceof Array) {
			for (var i=0; i<IDTPN.length; i++) {
				ids += ((ids=="") ? "" : "||")  + IDTPN[i] ;
			}
		} else {
			ids=IDTPN;
		}
		
		var ajaxOptions = {
			url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxQueryByIDServlet',
			method: 'post',
			params: {
				codTPN: codTPN, 
				IDTPN: ids, 
				SRID: this.paramsJS.mappe.SRID, 
				format: 'ext',
				paramPreset: this.paramsJS.nomePreset
				},
			success: onSuccess,
			failure: onFailure || this.showAjaxError,
			scope: scope || this
		}

		// Aggiunta parametri WMS da url
		Ext.apply(ajaxOptions.params, this.paramsJS.urlAdditionalParams);
		
		new TolomeoExt.ToloCrossAjax().request(ajaxOptions);
	},
	
	/**
	 * Method: addSelectedByID
	 * Aggiunge a selected interrogando via ajax il layer per codTPN ed IDTPN 
	 *
	 * Parameters:
	 * codTPN - {String} codTPN
	 * IDTPN - {String or Array} IDTPN
	 * bClearUrl - Indica se resettare l'eventuale pagina di identify 
	 *
	 * Returns:
	 * {<JSGeometryArray>}
	 */
	addSelectedByID: function (codTPN, IDTPN, bClearUrl) {		
		this.queryingById(codTPN, IDTPN, function(res) { this.doAddSelectedByIDAjaxCallback(res, bClearUrl); }, this.doAddSelectedByIDAjaxFailure, this);
	},
	
	/**
	 * Method: zoomToSelected
	 * Esegue lo zoom ad una zona selezionata.
	 *
	 * Parameters:
	 * scale - {Number} zoom, se valorizzato viene fatto lo zoom alla data scala
	 * buffer - {Number} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	 */
	zoomToSelected: function(zoom, buffer) {
		this.viewer.pluginZoomToSelected(zoom, buffer);
	},
	
	/**
	 * Method: centerOnSelected
	 * Riposiziona la mappa mettendo al centro la feature selezionata e mantenendo la scala attuale.
	 */
	centerOnSelected: function(){
		var zoom = this.viewer.pluginGetCurrentZoom();
		this.zoomToSelected(zoom);
	},
	
	/**
	 * Method: zoomToHighlighted
	 * Esegue lo zoom ad una zona evidenziata.
	 * 
	 * Parameters:
	 * zoom - {Number} il valore di zoom.
	 * buffer - {Integer} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	 */
	zoomToHighlighted: function(zoom, buffer) {
		this.viewer.pluginZoomToHighlighted(zoom, buffer);
	},
	
	/**
	 * Method: centerOnHighlighted
	 * Riposiziona la mappa mettendo al centro la feature evidenziata e mantenendo la scala attuale.
	 */
	centerOnHighlighted: function(){
		var zoom = this.viewer.pluginGetCurrentZoom();
		this.zoomToHighlighted(zoom);
	},
	
	/**
	 * Method: zoomToAutoidentified
	 *
	 * Parameters:
	 * zoom - {Number} il valore di zoom.
	 */
	zoomToAutoidentified: function(zoom) {
		this.viewer.pluginZoomToAutoidentified(zoom);
	},	
	
	/**
	 * Method: zoomToExtent
	 * Esegue lo zoom alla massima estenzione della mappa.
	 * 
	 * Parameters:
	 * geometry - {Mixed} Stringa wkt della geometria o oggetto di tipo BBox
	 * buffer - {Number} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	 */
	zoomToExtent: function(geometry, buffer) {
		this.viewer.pluginZoomToExtent(geometry, buffer);
	},	
	
	/**
	 * Method: zoomToScale
	 * esegue lo zoom ad una specifica scala.
	 * 
	 * Parameters:
	 * scale - {Number} il valore di scala.
	 */
	zoomToScale: function (scale){
		this.viewer.pluginZoomToScale(scale);
	},
	
	/**
	 * Method: zoomToObj
	 * Esegue uno zoom all'oggetto dopo aver interrogato il server per recuperare la geometria
	 * per mezzo di codTPN e IDTPN.
	 * Se il parametro selectIt � impostato a true l'oggetto viene selezionato, se = false viene evidenziato 
	 * Se bMulti == true e selectIt==false viene abilitata l'evidenziazione multipla (l'oggetto viene evidenziato insieme agli altri eventualmente gi� evidenziati) 
	 *
	 * Parameters:
	 * codTPN - {String} codice del layer
	 * IDTPN - {String o Array} id della feature
	 * selectIt - {Boolean} se true viene selezionato
	 * scale - {Integer} scala, se valorizzato viene fatto lo zoom alla data scala
	 * buffer - {Integer} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	 */
	zoomToObj: function(codTPN, IDTPN, selectIt, scale, buffer) {
		var onSuccess = function(res) { this.doZoomToObjAjaxCallback(res, selectIt, scale, buffer); };
		this.queryingById(codTPN, IDTPN, onSuccess, this.showAjaxError);	
	},

	/**
	 * Method: doZoomToObjAjaxCallback
	 * Funzione di callback della chiamata Ajax che effettua la zoomToObj
	 *
	 * Parameters:
	 * res - {} risposta della chiamata ajax
	 * selectIt - {Boolean} se true viene selezionato
	 * scale - {Integer} scala, se valorizzato viene fatto lo zoom alla data scala
	 * buffer - {Integer} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	 */
	doZoomToObjAjaxCallback: function(res, selectIt, scale, buffer) {
		var geoms = new JSGeometryArray();
		geoms.FromUntypedArray(res[0].data);
		
		if (geoms.geometries.length>0) {
			if(selectIt && this.paramsJS.isSelectable(geoms.geometries[0].codTPN)) {
				this.clearSelected();			
				this.addSelected(geoms);
				this.zoomToSelected(scale, buffer);
			} else {
				this.clearHighLigthed();
				this.addHighlighted(geoms);
				this.zoomToHighlighted(scale, buffer);
			}
		}
	},
	
	/**
	 * Method: doAddSelectedByIDAjaxCallback
	 * Funzione di callback della chiamata Ajax che effettua la addSelectedByID 
	 *
	 * Parameters:
	 * res - {} risposta della chiamata ajax
	 *  bClearUrl - Indica se resettare l'eventuale pagina di identify 
	 */
	doAddSelectedByIDAjaxCallback: function (res, bClearUrl) {
		//var geoms = new JSGeometryArray(transport.responseText);
		var geoms = new JSGeometryArray();
		geoms.FromUntypedArray(res[0].data);
		 
		this.addSelected(geoms, undefined, undefined, bClearUrl);
	},

	/**
	 * Method: doAddSelectedByIDAjaxFailure
	 * Funzione di gestione errore avvenuto nella chiamata Ajax che effettua la ricerca
	 *
	 * Parameters:
	 * transport - {} risposta della chiamata ajax
	 */
	doAddSelectedByIDAjaxFailure: function (transport) {
		//TODO CrossAjax riadattare
		showAjaxError(transport);
	},

	/**
	 * Method: clearSelected
	 * Svuota la selezione corrente, deselezionando gli oggetti dalla mappa ed effettuando il resto delle operazioni necessarie (come l'aggiornamento delle operazioni di editing, interrogazione etc. possibili)
	 * Nel caso che sia definito codTPN l'operazione viene fatta solo sugli oggetti del layer corrispondente
	 *
	 * Parameters:
	 * bRedraw - {Boolean} bRedraw
	 * codTPN - {Integer} codTPN
	 *  bClearUrl - Indica se resettare l'eventuale pagina di identify 
	 */
	clearSelected: function (bRedraw, codTPN, bClearUrl) {
		this.selezioneCorrente.clear(codTPN);
		if (bClearUrl==undefined || bClearUrl==null) bClearUrl = true; 
		
		// Elimina eventuale pagina di identify
		if (top.pannello && bClearUrl) this.clearURL ("pannello", "GET");
		
		
		if (bRedraw) this.applyCustomQuery();
		if (this.viewer.pluginClearSelected(bRedraw, codTPN)) this.viewer.pluginRefreshMap();
		// Modifica di conseguenza le operazioni possibili (icone)
		//TODO
		this.togglePermittedOperations();
	},

	/**
	 * Method: refreshSelected
	 * Aggiorna la selezione rileggendo dal layer la geometria attualmente selezionata
	 */
	refreshSelected: function () {
		if (this.selezioneCorrente.size()!=0) {
			
			var buff = new Array();
			for (var i=0;i<this.selezioneCorrente.geometries.length;i++) {
				var elem = new Object();
				elem.codTPN = this.selezioneCorrente.geometries[i].codTPN;
				elem.key = this.selezioneCorrente.geometries[i].key;
				buff.push(elem);
			}
			
			this.clearSelected(undefined, undefined, false);
			for (var i=0;i<buff.length;i++) {
				this.addSelectedByID(buff[i].codTPN, buff[i].key, false);
			}
		}
		
	},
	
//	/**
//	 * Method: zoomToExtent
//	 * Visualizza sulla mappa l'intero extent passato 
//	 *
//	 * Parameters:
//	 * geometryWKT - {} rappresentazione WKT della geometria da inquadrare
//	 */
//	zoomToExtent: function (geometryWKT){
//		this.viewer.pluginZoomToExtent(geometryWKT);
//	},
		
	/**
	 * Method: addMarker 
	 * Aggiunge un marker alla  mappa.
	 * 
	 * Parameters:
	 * x - {Integer} x
	 * y - {Integer} y
	 */
	addMarker: function(x,y) {
		this.viewer.pluginAddMarker(x,y);
	},
	
	/**
	 * Method: setMarker 
	 * Imposta un marker sulla  mappa, cancellando markers esistenti
	 * 
	 * Parameters:
	 * x - {Integer} x
	 * y - {Integer} y
	 */
	setMarker: function(x,y) {
		this.viewer.pluginAddMarker(x,y,null,true);
	},
	
	/**
	 * Method: clearMarkers
	 * Rimuove un marker dalla mappa.
	 *
	 * Parameters:
	 * x - {Integer} x
	 * y - {Integer} y
	 */
	clearMarkers: function(x,y) {
		this.viewer.pluginClearMarkers();
	},
	
	/**
	 * Method: addPopup 
	 * Aggiunge un popup alla  mappa.
	 * 
	 * Parameters:
	 * x - {Integer} x
	 * y - {Integer} y
	 * htmlText - {String} testo html
	 * isUnique - {boolean} se deve essere l'unico popup presente
	 */
	addPopup: function(x,y,htmlText,isUnique) {		
		this.viewer.pluginAddPopup(x,y,htmlText,isUnique);
	},	

	/**
	 * Method: updateImplicitCustomQuery
	 *  
	 */
	updateImplicitCustomQuery: function (){
	
		this.implicitCustomQuery = new Object();
		
		// Aggiunta SelectCustomQuery
		for(var index=0; index<this.paramsJS.azioniEventi.eventiLayerList.length; index++) {
			var paramJSLayer = this.paramsJS.azioniEventi.eventiLayerList[index];
		
			if (((paramJSLayer.customQueryOnSelect) && (paramJSLayer.customQueryOnSelect!='')) || 
				((paramJSLayer.customQueryOnNOSelect) && (paramJSLayer.customQueryOnNOSelect!=''))){
				var sel = this.selezioneCorrente.getByCodTPN(paramJSLayer.codTPN)
				var codTPN = paramJSLayer.codTPN;
				var buffCodTPN = codTPN + '';
				buffCodTPN = buffCodTPN.replace("-","M");
				var nome = "CQSELCOD" + buffCodTPN;	
				// ReplaceAll %SELCOD%
				 
				var valore = null;			
				
				if (sel) {
					// ci sono oggetti selezionati per questo layer
					valore = paramJSLayer.customQueryOnSelect;	
					var RE = new RegExp("%SELCOD%", "ig");
					valore = valore.replace(RE, codTPN);
					
					// ReplaceAll 
					var RE = new RegExp("%SELID%", "ig");
					valore = valore.replace(RE, sel.geometries[0].key);
					
				} else {
					// Non ci sono oggetti selezionati per questo layer
					valore = paramJSLayer.customQueryOnNOSelect;
				}
				
				eval ("this.implicitCustomQuery."+nome+"=valore");
			}            	
		}
		
		this.implicitCustomQuery.CQTEMPORALFILTERDTINIZIO = this.temporalFilterDtInizio; 
		this.implicitCustomQuery.CQTEMPORALFILTERDTFINE = this.temporalFilterDtFine;
		
	},
	
	/**
	 * Method: applyCustomQuery
	 * Consente di utilizzare una query personale.
	 * 
	 */
	applyCustomQuery: function (){
	
		var params = this.getCustomQueryParams();
	
		if ( !this.paramsPrev || (Ext.JSON.encode(params)!= Ext.JSON.encode(this.paramsPrev))) this.viewer.pluginUpdateCustomQuery(params);
		
		this.paramsPrev=params;
		
	},
		
	/**
	 * Method: getCustomQueryParams
	 * 
	 */
	getCustomQueryParams: function () {
	
		var params = new Array();
	
		this.updateImplicitCustomQuery();
		
		for (var i = 0; i<this.paramsJS.mappe.mappaList.length; i++) {
			
			var mappa = this.paramsJS.mappe.mappaList[i];
		
			var customQueryParams = new Object();
		    for (var j=0;j<mappa.customQueryList.length ;j++) {
		    	eval ("customQueryParams."+mappa.customQueryList[j].nome+"='"+mappa.customQueryList[j].query+"';");
		   	}
		   	
		    var customQueryParams = Ext.apply(customQueryParams,this.implicitCustomQuery );
		   	
		   	params.push(customQueryParams);        
		
		}
		
		return params;
		
	},

	/**
	 * Method: gotoPosition 
	 *
	 * Parameters:
	 * coordX - {Integer} coordinata X.
	 * coordY -{Integer} coordinata Y.
	 * zoomFactor - {} livello di zoom.
	 * withMarker - {} withMarker.
	 * crsCode - {String} codice EPSG del sitema di riferimento in cui sono le coordinate passate.
	 */
	gotoPosition: function (coordX, coordY, zoomFactor, withMarker, crsCode) {
		
		zoomFactor = zoomFactor || this.viewer.pluginGetCurrentZoom();
		var currPoint = new Point(coordX,coordY);
		
		// Se � stato passato un sistema di riferimento fra qelli gestiti e diverso da quello attuale
		// riproietto le coordinate
		if(crsCode && this.projectionCrs[crsCode]){
			var currSrsCode = this.getProjectionCode();
			if(currSrsCode != crsCode){
				var currProj = new TolomeoExt.Projection(currSrsCode);
				var sourceProj = new TolomeoExt.Projection(crsCode);		
				currPoint = TolomeoExt.Projection.transform(currPoint,sourceProj,currProj);
			}		
		}				
		this.viewer.pluginGotoPosition(currPoint.x, currPoint.y, zoomFactor, withMarker, this.TOLOMEOServer+'/img/markers/arrow_Marker.png'); 
	},
	
	/**
	 * Method: doOpenActionsJS
	 * 
	 */
	doOpenActionsJS: function() {
		if (this.openActionsJS!=null) {
			this.openActionsJS();
		} 
		
		var bOnOpenDrawMap = false;
		var bUnComando = false;
		var buff;
		
		var queryString = window.location.toString();
		var pos = queryString.indexOf('?')
		if (pos!=-1) {
			queryString = queryString.substr(pos);
			var qsObj = Ext.Object.fromQueryString(queryString);
			if (qsObj.cmdUrl || qsObj.cmdUrlComp) {
				bUnComando = true;
				pro = Ext.create('TolomeoExt.ToloProcedure', {
			    			cmdUrl: qsObj.cmdUrl,
			    			cmdUrlComp: qsObj.cmdUrlComp
			    		});
			    		
			    buff = 	pro.run(this);	
			    bOnOpenDrawMap = bOnOpenDrawMap || buff;
			} 
			
			// Popups.
			// Fare prima di posizionamento perch� openalyers sembra spostare la mappa quando si aggiugono popup 
			if (qsObj.popup) {
				bUnComando = true;
				var conf = [];
				if (qsObj.popup instanceof Array) {
					for (var i=0; i<qsObj.popup.length ; i++) {
						var arg = qsObj.popup[i].split("|"); 
						conf.push({x: arg[0], y: arg[1], t: arg[2]});
					}
				} else {
					var arg = qsObj.popup.split("|"); 
					conf.push({x: arg[0], y: arg[1], t: arg[2]});
				}
				
				var popUpCommand = Ext.create('TolomeoExt.ToloCommand.addPopups', { conf: conf });
				buff = popUpCommand.run(this);
				bOnOpenDrawMap = bOnOpenDrawMap || buff; 
			}
			
			// Posizonamento per extent
			if (qsObj.left && qsObj.bottom && qsObj.right && qsObj.top) {
				bUnComando = true;
				var zoomToCommand = Ext.create('TolomeoExt.ToloCommand.zoomToExtent', { left: qsObj.left, bottom: qsObj.bottom, right: qsObj.right, top: qsObj.top });
				buff = zoomToCommand.run(this);
				bOnOpenDrawMap = bOnOpenDrawMap || buff;
			}
			
			// Positionamento per centro e scala
			if (qsObj.x && qsObj.y && qsObj.scale) {
				bUnComando = true;
				var zoomToCommand = Ext.create('TolomeoExt.ToloCommand.zoomTo', { x:qsObj.x, y: qsObj.y, s: qsObj.scale });
				buff = zoomToCommand.run(this);
				bOnOpenDrawMap = bOnOpenDrawMap || buff;
			}
			
			this.viewer.bOnOpenDrawMap = this.viewer.bOnOpenDrawMap || bOnOpenDrawMap || !bUnComando;			
		}
		
	},	

	/**
	 * Method: doOpenActions
	 * Esegue le azioni di apertura definite nel file .xml, come il posizionamento etc
	 */
	doOpenActions: function (){

		var action = this.paramsJS.azioniApertura.action;
	   	
	   	if (action == "ZoomTo") {      
	   		this.viewer.pluginGotoPosition (this.paramsJS.azioniApertura.coordX, this.paramsJS.azioniApertura.coordY, this.paramsJS.azioniApertura.zoom, true);      
		} if (action == "ZoomToOgg")  {
			if ((this.paramsJS.azioniApertura.zoomToJSGeometry!=null) & (this.paramsJS.azioniApertura.zoomToJSGeometry!="")) {
				var geoms = new JSGeometryArray();
				
				geoms.FromUntypedArray(this.paramsJS.azioniApertura.zoomToJSGeometry);
				if ((geoms.geometries.length==1) && (geoms.geometries[0].geometry!="")) {
				
					if (this.paramsJS.azioniApertura.modoEditingSingolo != null && 
						this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!=null &&
						this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!="") {
							// Se c'� modoEditingSingolo allora uso highlight perch� selected viene usato da editing singolo
							addHighlighted(geoms);
							if (geoms.geometries[0].isPoint()) {
								this.zoomToHighlighted(this.paramsJS.azioniApertura.zoom);
							} else {
								this.zoomToHighlighted();
							}	
					} else {
						
						// Se non c'� modoEditingSingolo allora uso selected, almeno le azioni sono subito disponibili
						this.addSelected(geoms);
						if (geoms.geometries[0].isPoint()) {
							this.pluginZoomToSelected(this.paramsJS.azioniApertura.zoom);
						} else {
							this.pluginZoomToSelected();
						}
					}
					
				}
			}
		}
		
		if (this.paramsJS.azioniApertura.urlPannello != null && this.paramsJS.azioniApertura.urlPannello != "") {
			var method = (this.paramsJS.azioniApertura.method || 'POST').toUpperCase();
			this.openURL(this.paramsJS.azioniApertura.urlPannello, "pannello", method);
		}
		
		// Modo editing singolo. 
		// Se gi� presente seleziona e zoomToSelected all'oggetto da modificare,
		// altrimenti nulla 
		if (this.paramsJS.azioniApertura.modoEditingSingolo != null && 
			this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!=null &&
			this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!="") {
			//if (this.paramsJS.azioniApertura.modoEditingSingolo.conInsert==false) {
				//params.getAzioniApertura().getModoEditingSingolo().setEditingJSGeometry
				var geoms = new JSGeometryArray();
			
				geoms.FromUntypedArray(this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry);
				if ((geoms.geometries.length==1) && (geoms.geometries[0].geometry!="")) {
					this.addSelected(geoms);
					if (geoms.geometries[0].isPoint()) {
						this.zoomToSelected(this.paramsJS.azioniApertura.zoom);
					} else {
						this.zoomToSelected();
					}
				}
				
			//}
		}
	},
	
	cleanJSONQuotesOnKeys: function (json) {
    	return json.replace(/"(\w+)"\s*:/g, '$1:');
	},
	
	generatePermalink: function() {
		
		var proc = Ext.create('TolomeoExt.ToloProcedure', {});
		
		if(this.TOCPanel){
			var pl = this.TOCPanel.saveToCommand();
			proc.addCommand(pl);
		}

		// Popups
		// Fare prima di posizionamento
		var conf = [];
		var popups = this.viewer.pluginGetOpenedPopups();
		for (var i=0; i < popups.length; i++) {
			var p = popups[i];
			conf.push({x: p.lonlat.lon , y: p.lonlat.lat, t: p.contentHTML});
		}
		var zt = Ext.create('TolomeoExt.ToloCommand.addPopups', 
							{ conf:conf	});
		proc.addCommand(zt);
		
		/* La posizione viene aggiunta in chiaro su richiesta di RT
		var zt = Ext.create('TolomeoExt.ToloCommand.zoomTo', {
								x:this.viewer.pluginGetCurrentX(),
								y:this.viewer.pluginGetCurrentY(),
								s: this.viewer.pluginGetCurrentZoom()});
		proc.addCommand(zt);
		*/

		var cmdParamNoQuotes=Ext.JSON.encode(proc); //this.cleanJSONQuotesOnKeys(Ext.JSON.encode(proc));
		var cmdParamNoQuotesComp = LZString.compressToBase64(cmdParamNoQuotes); 
		
		//var msg =  "Lunghezza originale: " + encodeURIComponent(cmdParamNoQuotes).length;
		//msg += "<br/>" + "Lunghezza compressa:" + cmdParamNoQuotesComp.length;
		//msg += "<br/>";
		
		var pos = window.location.href.indexOf("?");
		var qs = {};
		if (pos!=-1) {
			qs = Ext.Object.fromQueryString(window.location.href.substring(pos));
		}
		qs.cmdUrlComp = LZString.compressToBase64(cmdParamNoQuotes);
		
		qs.x = this.viewer.pluginGetCurrentX();
		qs.y = this.viewer.pluginGetCurrentY();
		qs.scale = this.viewer.pluginGetCurrentZoom();

		//var proc1 = Ext.create('TolomeoExt.ToloProcedure', {});
		//proc1.addCommand(zt);
		//qs.cmdUrl=this.cleanJSONQuotesOnKeys(Ext.JSON.encode(proc1));
		
		var qs1 = window.location.protocol + "//" + window.location.host + window.location.pathname;
		
		qs1=Ext.String.urlAppend(qs1, Ext.Object.toQueryString(qs));
		
		return qs1;
		
	},
	
	
	showPermalink: function() {
		
		var permalink = this.generatePermalink();
		
		//window.location.href + ((window.location.href.indexOf("?")==-1) ? "?" : "&")  + "cmdUrlComp=" + LZString.compressToBase64(cmdParamNoQuotes) + '
		//var msg = '<a target="_blank" href="' + permalink +'">Permalink</a>';

		//Ext.MessageBox.show({title: "Permalink",  msg: msg });
		
		Ext.create('Ext.window.Window', {
		    title: 'Permalink',
		    iconCls: 'iconPermalink',
		    modal: true,
		    height: 200,
		    width: 400,
		    layout: 'fit',
		    items: { 
		        xtype     : 'textareafield',
		        grow      : false,
		        name      : 'permalink',
		        fieldLabel: '',
		        id : 'permalinkTextArea',
		        anchor    : '100%',
		        value : permalink,
		        selectOnFocus: true		        		        
		    },
		    dockedItems: [{
		        xtype: 'toolbar',
		        dock: 'bottom',
		        items: ['->','-',{
		        	iconCls: 'iconOpenInNewWin',
		            text: 'Apri in nuova finestra',
		            listeners : {
			        	click : {
			        		fn :  function(){		        			
			        			window.open(permalink,"_blank");
			        		}
			        	}
			        }
		        }]
		    }],
		    listeners : {
	        	show : {
	        		fn :  function(){		        			
	        			this.items.getByKey('permalinkTextArea').focus();
	        		}
	        	}
	        }
		}).show();
						
	},
	
	exportForQgis : function(catIdx, layIdx){
		
		if(!this.TOCPanel) return;				
		
		this.exportForm.getForm().setValues({
			tocInfo: this.TOCPanel.tocInfo.JSONEncodeInfo(catIdx, layIdx),
			paramsJS: Ext.JSON.encode(this.paramsJS),
			nMappa: '0',
			idxCategoriaBase: catIdx,
			idxLayerBase: layIdx
		});
		
		this.exportForm.submit({
			url: this.TOLOMEOServer + this.TOLOMEOContext + '/ExportToQgisServlet',
			method: 'POST',
			target: '_blank'
		});
	},
	
	/**
	 * Method: onDigitizeEndGeometry
	 * Funzione chiamata alla fine del processo di digitalizzazione. 
	 * Viene invocata dalle funzioni piu' specifiche onDigitizeEndPolygon, onDigitizeEndPoint etc.
	 *
	 * Parameters:
	 * geometry - {JSGeometry} la geometria.
	 */
	onDigitizeEndGeometry: function (geometry){

		var	layer = this.getCurrentSelectLayer();
		
		// Se editing singolo ed � definita una geometria editing singolo 
		// (come nel caso di geometrie esistenti da modificare o delle quali inserire la geometria)
		// allora utilizzo la geometria esistente e modifico il solo campo geometria
		if ((this.paramsJS.azioniApertura.modoEditingSingolo!=null) && (this.paramsJS.azioniApertura.modoEditingSingolo!="") &&
			(this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!= null) && (this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!="")) {
			var geoms = new JSGeometryArray();
			geoms.FromUntypedArray(this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry);
			var geom1 = geoms.geometries[0];
			geom1.geometry = geometry.geometry;
			geometry = geom1;
			geometry.SRID = this.paramsJS.mappe.SRID;
			if (this.currentDigitizeOperation==this.digitizeOperationInsert) {
				this.geoOpToPostVar(this.operationGeometryModify);	
			} else {
				this.geoOpToPostVar(this.currentDigitizeOperation);
			}
		} else {
			geometry.codTPN = layer.codTPN;
			geometry.SRID = this.paramsJS.mappe.SRID;
			this.geoOpToPostVar(this.currentDigitizeOperation);
		}
		this.geometryToPostVar (geometry);
		switch (this.currentDigitizeOperation) {
	   		case this.digitizeOperationInsert:
	   			this.onDigitizeEndInsert(geometry);
	   			if ((this.paramsJS.azioniApertura.modoEditingSingolo!=null) && (this.paramsJS.azioniApertura.modoEditingSingolo!="") &&
					(this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!= null) && (this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!="")) {
	   				this.addSelectedByID(this.paramsJS.azioniApertura.modoEditingSingolo.layerCODTPN, this.paramsJS.azioniApertura.modoEditingSingolo.valoreChiave);
				} 
	   			break;
	   		case this.digitizeOperationSubtract:
	   			this.onDigitizeEndSubtract(geometry);
	   			//refreshSelected();
	   			break;
	   		case this.digitizeOperationAdd:
	   			this.onDigitizeEndAdd(geometry);
	   			//refreshSelected();
	   			break;
	   		case this.digitizeOperationAddSub:
	   			this.onDigitizeEndAddSub(geometry);
	   			//refreshSelected();
	   			break;
	   		case this.digitizeOperationVertexEdit:
	   			this.digitizeEndVertexEdit(geometry);
	   			//refreshSelected();
	   			break;
	   		case this.digitizeOperationDragDrop:
	   			this.digitizeEndDragDrop(geometry);
	   			//refreshSelected();
	   			break;
	   		default: alert ('Operazione non supportata ' + currentDigitizeOperation);

	   	}

		this.currentDigitizeOperation = '';
	    this.fireEvent('onOperationPressDefault', 2);
	},	

	/**
	 * Method: onDigitizeEndInsert
	 * Funzione chiamata alla fine del processo di digitalizzazione nel caso che l'operazione sia un inserimento. Viene invocata dalla funzione pi� generale onDigitizeEndGeometry etc.
	 * Si occupa di chiedere conferma ed eventualmente eseguire le azioni richieste invocando la doEventActions
	 *
	 * Parameters:
	 * geometry - {JSGeometry} la geometria.
	 */
	onDigitizeEndInsert: function (geometry){

		var layer = this.getCurrentSelectLayer();	
		var messint = "Attenzione! Il poligono disegnato verr&agrave; inserito \nin un nuovo record \ndel layer '" + layer.descrizioneLayer + "'";
		messint = messint + ".\n\nCliccare OK per continuare.";
		
		if (confirm(messint)) {
			this.validateDigitizeOperation(layer, function() {
				if ((this.paramsJS.azioniApertura.modoEditingSingolo != null ) && (this.paramsJS.azioniApertura.modoEditingSingolo != "" )) {
					var edGeom = this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry;
					if ((edGeom!=null) && (edGeom!="")) {
						// Se l'oggetto esiste vuol dire che l'inserimento si riferiva alla sola geometria (quindi e' un update)
						this.doEventActions(layer, this.eventUpdateGeom, this.paramsJS.azioniApertura.modoEditingSingolo.valoreChiave);
						this.digitizeLayerConditionalClear(layer, this.eventUpdateGeom);
					} else {
						// Se l'oggetto non esiste vuol dire che deve essere vero inserimento
						this.doEventActions(layer, this.eventIns, this.paramsJS.azioniApertura.modoEditingSingolo.valoreChiave);
						this.digitizeLayerConditionalClear(layer, this.eventIns);
					}
				} else {
					this.doEventActions(layer, this.eventIns, null);
					this.digitizeLayerConditionalClear(layer, this.eventIns);
				}
			},
			function (errMsg,isAjaxError) {
				if(isAjaxError){
					this.showAjaxError(errMsg);
				}else{
					alert (errMsg);					
				} 					
				this.digitizeLayerClear();	 		 
			})	 
		} else {
			this.digitizeLayerClear();	
		}
		
		if ((this.paramsJS.azioniApertura.modoEditingSingolo != null ) && (this.paramsJS.azioniApertura.modoEditingSingolo != "" )) {
			this.bEditingSingoloInsertDone=true;
		}
	},

	/**
	 * Cancella tutto il contenuto del layer di digitalizzazione se � previsto da configurazione (file preset) questo comportamento a fine digitalizzazione.
	 * Nel caso che non sia prevista la cancellazione attiva l'editing se previsto nel file di preset 
	 * 
	 * @param {} eventoLayer
	 * @param {} tipoEvento
	 */
	digitizeLayerConditionalClear: function(eventoLayer, tipoEvento) {
		
		var azioniEventi = this.getAzioniEventi(eventoLayer, tipoEvento);
		if (azioniEventi.digitizedFeatureClear) {
			this.digitizeLayerClear();
		} else {
			this.viewer.pluginStartDigitizedFeatureModify(azioniEventi.digitizedFeatureModifyMode);
			this.viewer.on('onDigitizedFeatureDragDropEnd', this.digitizedFeatureModifyEnd,this);
			this.viewer.on('onDigitizedFeatureVertexEditingEnd', this.digitizedFeatureModifyEnd,this);
			
		}
			
		
	},
	
	/**
	 * Cancella tutto il contenuto del layer di digitalizzazione e disabilita l'editing eventualmente attivato
	 */
	digitizeLayerClear: function() {
		this.viewer.pluginDigitizeLayerClear();
		this.viewer.pluginStopDigitizedFeatureModify();
		this.viewer.un('onDigitizedFeatureDragDropEnd',this.digitizedFeatureModifyEnd, this);
		this.viewer.un('onDigitizedFeatureVertexEditingEnd', this.digitizedFeatureModifyEnd, this);
	},
	
	/**
	 * Method: onDigitizeEndAdd
	 * Funzione chiamata alla fine del processo di digitalizzazione nel caso che l'operazione sia una aggiunta di poligono. Viene invocata dalla funzione pi� generale onDigitizeEndGeometry etc.
	 * Si occupa di chiedere conferma ed eventualmente eseguire le azioni richieste invocando la doEventActions
	 *
	 * Parameters:
	 * geometry - {JSGeometry} la geometria.
	 */
	onDigitizeEndAdd: function (){

	 	var layer = this.getCurrentSelectLayer();
	 	//ALE1
	 	// Assumo che esista e che sia uno solo perch� altrimenti non dovrebbe essere abilitato il pulsante che 
	 	// ha dato origine a questa azione
	 	var selCorrente = this.selezioneCorrente.getByCodTPN(layer.codTPN).geometries[0];
	 	var chiaveSelCorrente =  selCorrente.key;
		var messint = "Attenzione! Il poligono disegnato verra' aggiunto \sul layer '" + layer.descrizioneLayer + "'";
		messint = messint + ".\n\nCliccare OK per confermare la creazione del poligono.";
		if (confirm(messint)) {
			this.validateDigitizeOperation(layer, function() {
											this.doEventActions(layer, this.eventUpdateGeom,  chiaveSelCorrente, undefined, undefined, undefined, selCorrente);
											this.digitizeLayerConditionalClear(layer, this.eventUpdateGeom);
												  }, 
											function (errMsg,isAjaxError) {
												if(isAjaxError){
													this.showAjaxError(errMsg);
												}else{
													alert (errMsg);					
												} 					
												this.digitizeLayerClear();			 
											}	 
									) 	
		} else { 
			this.digitizeLayerClear();		
		}
		
	},

	/**
	 * Method: validateDigitizeOperation
	 * Valida la digitazione.
	 * 
	 * Parameters:
	 * layer - {} il layer.
	 * funcSuccess - {Function} funcSuccess
	 * funcError - {Function} funcError
	 */
	validateDigitizeOperation: function (layer, funcSuccess, funcError) {
					
		//Chiamata ajax
		var ajaxOptions = { method: 'post',
							url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxGeometryValidationServlet',
							scope: this,
							params: {geoOp: this.geoOpField.getValue(), 
										 geoCoord: this.geoCoordField.getValue(),
										 codTPN:   layer.codTPN,
										 format: 'ext',
										 urlAdditionalParams: this.paramsJS.urlAdditionalParams,
										 paramPreset: this.paramsJS.nomePreset
										 },
							success: function(results, store) {
											 
											//var resp = eval('(' + transport.responseText + ')');
											//var errori = resp.errori;
											 
											if (results.length==0) {
												funcSuccess.call(this);
											} else {
												//Errore di validazione
												var errMsg = results[0].data.errorMessage;
												for (i=1;  i<results.length; i++) {
													errMsg += '\n' + results[i].data.errorMessage;
												}
												if(funcError){ 
													// Passa il messaggio di errore e dice che l'errore NON � Ajax
													funcError.call(this,errMsg,false); 
												}else{
													alert (errMsg);
												}												
											}				
									  },
							failure: function (store) { 
										//validateDigitizeOperation.showAjaxError(transport);
										if(funcError){ 
											// Passa il messaggio di errore e dice che l'errore � Ajax
											funcError.call(this,"Si � verificato un errore HTTP!",true);
										}else{
											this.showAjaxError(transport);
										} 
									 } 
						  }

		// Aggiunta parametri WMS da url
		Ext.apply(ajaxOptions.params, this.paramsJS.urlAdditionalParams);
		
		new TolomeoExt.ToloCrossAjax().request(ajaxOptions);				
	},
	

	/**
	 * Method: digitizeEndVertexEdit
	 * Funzione chiamata alla fine del processo di digitalizzazione nel caso che l'operazione sia una modifica dei vertici. Viene invocata dalla funzione pi� generale onDigitizeEndGeometry etc.
	 * Si occupa di chiedere conferma ed eventualmente eseguire le azioni richieste invocando la doEventActions
	 *
	 * Parameters:
	 * geometry - {JSGeometry} la geometria.
	 */
	digitizeEndVertexEdit: function (geometry){

	 	var layer = this.getCurrentSelectLayer();
	 	 // Assumo che esista e che sia uno solo perch� altrimenti non dovrebbe essere abilitato il pulsante che 
	 	// ha dato origine a questa azione
	 	var selCorrente = this.selezioneCorrente.getByCodTPN(layer.codTPN).geometries[0];
	 	var chiaveSelezione =  selCorrente.key;
		//var chiaveSelezione = selezioneCorrente.key;
		var messint = "Attenzione! La modifica effettuata sara' riportata \n sul layer '" + layer.descrizioneLayer + "'";
		messint = messint + ".\n\nCliccare OK per confermare la creazione del poligono.";
		if (confirm(messint)) {
			this.validateDigitizeOperation(	layer, 
									  	function() {
											this.doEventActions(layer, this.eventUpdateGeom,  chiaveSelezione, undefined, undefined, undefined, selCorrente);},
										function (errMsg,isAjaxError) { 
											if(isAjaxError){
												this.showAjaxError(errMsg);
											}else{
												alert (errMsg);		
												this.refreshSelected();			
											} 					 
										}) 
			
			}else{
				this.refreshSelected();
			}
		
	},

	/**
	 * Method: digitizeEndDragDrop
	 * Funzione chiamata alla fine del processo di digitalizzazione nel caso che l'operazione sia un drag drop. Viene invocata dalla funzione pi� generale onDigitizeEndGeometry etc.
	 * Si occupa di chiedere conferma ed eventualmente eseguire le azioni richieste invocando la doEventActions
	 *
	 * Parameters:
	 * geometry - {JSGeometry} geometry
	 */
	digitizeEndDragDrop: function (geometry){

	 	var layer = this.getCurrentSelectLayer();
	 	//var chiaveSelCorrente =  selezioneCorrente.key;
	 	// Assumo che esista e che sia uno solo perch� altrimenti non dovrebbe essere abilitato il pulsante che 
	 	// ha dato origine a questa azione
	 	var selCorrente = this.selezioneCorrente.getByCodTPN(layer.codTPN).geometries[0]
	 	var chiaveSelCorrente =  selCorrente.key;
		var messint = "ATTENZIONE! La modifica effettuata sar� riportata \n sul layer '" + layer.descrizioneLayer + "'";
		messint = messint + ".\n\nCliccare OK per confermare la creazione del poligono.";
		if (confirm(messint)) {
			this.validateDigitizeOperation(layer, 
										function() {
												this.doEventActions(layer, this.eventUpdateGeom,  chiaveSelCorrente, undefined, undefined, undefined, selCorrente);  },
										function (errMsg,isAjaxError) { 
											if(isAjaxError){
												this.showAjaxError(errMsg);
											}else{
												alert (errMsg);		
												this.refreshSelected();			
											} 					 
										}) 
			
		}else{
			this.refreshSelected();
		}
		
	},

	/**
	 * Method: onDigitizeEndSubtract
	 * Funzione chiamata alla fine del processo di digitalizzazione nel caso che l'operazione sia una sottrazione di poligono. 
	 * Viene invocata dalla funzione pi� generale onDigitizeEndGeometry etc.
	 * Si occupa di chiedere conferma ed eventualmente eseguire le azioni richieste invocando la doEventActions.
	 * 
	 */
	onDigitizeEndSubtract: function (){

		var layer = this.getCurrentSelectLayer();
		//var chiaveSelCorrente =  selezioneCorrente.key;
		// Assumo che esista e che sia uno solo perch� altrimenti non dovrebbe essere abilitato il pulsante che 
	 	// ha dato origine a questa azione
		var selCorrente = this.selezioneCorrente.getByCodTPN(layer.codTPN).geometries[0];
		var chiaveSelCorrente =  selCorrente.key;
		var messint = "Attenzione! Il poligono disegnato verra' cancellato \ndal layer '" + layer.descrizioneLayer + "'";
		messint = messint + ".\n\nCliccare OK per confermare la cancellazione del poligono.";
		if (confirm(messint)) {
			this.validateDigitizeOperation(layer, 
								function() {
									this.doEventActions(layer, this.eventUpdateGeom,  chiaveSelCorrente, undefined, undefined, undefined, selCorrente);  
									this.digitizeLayerConditionalClear(layer, this.eventUpdateGeom);
									},
									function (errMsg,isAjaxError) {
										if(isAjaxError){
											this.showAjaxError(errMsg);
										}else{
											alert (errMsg);					
										} 					
										this.digitizeLayerClear();			 
									}) 
			
			
		} else { 
			this.digitizeLayerClear();		
		}
	},

	/**
	 * Method: onDigitizeEndAddSub
	 * Funzione chiamata alla fine del processo di digitalizzazione nel caso che l'operazione sia una aggiunta e sottrazione (operazione su coperture) di poligono. 
	 * Viene invocata dalla funzione pi� generale onDigitizeEndGeometry etc.
	 * Si occupa di chiedere conferma ed eventualmente eseguire le azioni richieste invocando la doEventActions.
	 * 
	 * See Also:
	 * <doEventActions>
	 */
	onDigitizeEndAddSub: function (){

		var layer = this.getCurrentSelectLayer();
		//var chiaveSelCorrente =  selezioneCorrente.key;
		// Assumo che esista e che sia uno solo perch� altrimenti non dovrebbe essere abilitato il pulsante che 
	 	// ha dato origine a questa azione
		var selCorrente = this.selezioneCorrente.getByCodTPN(layer.codTPN).geometries[0];
	 	var chiaveSelCorrente =  selCorrente.key;
		var messint = "Attenzione! Il poligono disegnato verra' unito a quello selezionato \nsul layer '" + layer.descrizioneLayer + "',tagliando eventuali intersezioni\ncon altri poligoni.";
		messint = messint + ".\n\nCliccare OK per continuare.";
		if (confirm(messint)) {
			this.validateDigitizeOperation(layer, 
						function() {
				
											        
								this.doEventActions(layer, this.eventUpdateGeom,  chiaveSelCorrente, undefined, undefined, undefined, selCorrente); 
								this.digitizeLayerConditionalClear(layer, this.eventUpdateGeom);
									},
									function (errMsg,isAjaxError) {
										if(isAjaxError){
											this.showAjaxError(errMsg);
										}else{
											alert (errMsg);					
										} 					
										this.digitizeLayerClear();			 
									})
		} else { 
			this.digitizeLayerClear();		
		}
	},

	/**
	 * Method: onDigitizeStartInsert
	 * Funzione invocata per iniziare la digitalizzazione relativa ad una operazione di inserimento.
	 * 
	 */
	onDigitizeStartInsert:function () {
		this.digitizeStart(this.getCurrentSelectLayer().tipoGeometria);
	},

	/**
	 * Method: onDigitizeStopInsert
	 * Funzione invocata per interrompere (annullare) la digitalizzazione relativa ad una operazione di inserimento.
	 * Non confondere con onDigitizeEndInsert che � la fine regolare della digitalizzazione.
	 * 
	 */
	onDigitizeStopInsert: function () {
		this.digitizeStop(this.getCurrentSelectLayer().tipoGeometria);
	},
	
	/**
	 * Method: onDigitizeByCADStartInsert
	 * Funzione invocata per iniziare la digitalizzazione per mezzo di ACD relativa ad una operazione di inserimento.
	 * 
	 */
	onDigitizeByCADStartInsert:function () {
		this.digitizeByCADStart(this.getCurrentSelectLayer().tipoGeometria);
	},

	/**
	 * Method: onDigitizeByCADStopInsert
	 * Funzione invocata per interrompere (annullare) la digitalizzazione per mezzo di CAD relativa ad una operazione di inserimento.
	 * Non confondere con onDigitizeEndInsert che � la fine regolare della digitalizzazione.
	 * 
	 */
	onDigitizeByCADStopInsert: function () {
		this.digitizeByCADStop(this.getCurrentSelectLayer().tipoGeometria);
	},

	/**
	 * Method: onDigitizeStartSubtract
	 * Funzione invocata per iniziare la digitalizzazione relativa ad una operazione di sottrazione.
	 * 
	 */
	onDigitizeStartSubtract: function () {
		var modLayer = this.getCurrentSelectLayer();
		if (modLayer.tipoGeometria==geomTypePoint) {
			this.digitizeStart(geomTypePolygon);
		} else {
			this.digitizeStart(modLayer.tipoGeometria);
		}
	},

	/**
	 * Method: onDigitizeStopSubtract
	 * Funzione invocata per fermare (annullare) la digitalizzazione relativa ad una operazione di sottrazione.
	 * 
	 */
	onDigitizeStopSubtract: function () {
		var modLayer = this.getCurrentSelectLayer();
		if (modLayer.tipoGeometria==geomTypePoint) {
			this.digitizeStop(geomTypePolygon);
		} else {
			this.digitizeStop(modLayer.tipoGeometria);
		}

	},

	/**
	 * Method: onDigitizeStartAdd
	 * Funzione invocata per iniziare la digitalizzazione relativa ad una operazione di aggiunta.
	 * 
	 */
	onDigitizeStartAdd: function () {
	    var modLayer = this.getCurrentSelectLayer();
	    this.digitizeStart(modLayer.tipoGeometria);
	},

	/**
	 * Method: onDigitizeStopAdd
	 * Funzione invocata per fermare la digitalizzazione relativa ad una operazione di aggiunta.
	 * 
	 */
	onDigitizeStopAdd: function () {
	    var modLayer = this.getCurrentSelectLayer();
	    this.digitizeStop(modLayer.tipoGeometria);
	},

	/**
	 * Method: onDigitizeStartAddSub
	 * Funzione invocata per iniziare la digitalizzazione relativa ad una operazione di aggiunta/sottrazione (operazione su copertura).
	 * 
	 */
	onDigitizeStartAddSub: function () {
	    var modLayer = this.getCurrentSelectLayer();
	    this.digitizeStart(modLayer.tipoGeometria);
	},

	/**
	 * Method: onDigitizeStopAddSub
	 * Funzione invocata per fermare (annullare) la digitalizzazione relativa ad una operazione di aggiunta/sottrazione (operazione su copertura).
	 * 
	 */
	onDigitizeStopAddSub: function () {
	    var modLayer = this.getCurrentSelectLayer();
	    this.digitizeStop(modLayer.tipoGeometria);
	},

	/**
	 * Method: onDigitizeStartVertexEdit
	 * Funzione invocata per iniziare la modifica dei vertici.
	 */
	onDigitizeStartVertexEdit: function () {
	    var modLayer = this.getCurrentSelectLayer();
	    this.digitizeStartVertexEditing(modLayer.tipoGeometria);

	},
	
	/**
	 * Method: onDigitizeStopVertexEdit
	 * Funzione invocata per fermare (annullare) la modifica dei vertici.
	 * 
	 */
	onDigitizeStopVertexEdit: function () {
	    var modLayer = this.getCurrentSelectLayer();
	    this.digitizeStopVertexEditing(modLayer.tipoGeometria);
	},

	/**
	 * Method: onDigitizeStartDragDrop
	 * Funzione invocata per lo spostamento di un oggetto.
	 * 
	 */
	onDigitizeStartDragDrop: function () {
	    var modLayer = this.getCurrentSelectLayer();
	    this.digitizeStartDragDrop(modLayer.tipoGeometria);
	},

	/**
	 * Method: onDigitizeStopDragDrop
	 * Funzione invocata per fermare (annullare) lo spostamento di un oggetto.
	 * 
	 */
	onDigitizeStopDragDrop:function () {
	    var modLayer = this.getCurrentSelectLayer();
	    this.digitizeStopDragDrop(modLayer.tipoGeometria);
	},

	/**
	 * Method: digitizeStart
	 * Inizia la digitalizzazione (invocata dalle onDigitizeStartAddSub etc.)
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeStart: function (geomType){

		switch (geomType) {
	   		case geomTypePoint:
	   			this.viewer.pluginStartDigitizePoint(geomType);
	   		break;
	   		case geomTypeLine:
	   			this.viewer.pluginStartDigitizeLine(geomType);
	   		break;
	   		case geomTypePolygon:
	   			this.viewer.pluginStartDigitizePolygon(geomType);
	   		break;
	   		case geomTypeCircle:
	   			this.viewer.pluginStartDigitizeCircle(geomType);
	   		break;

	   	}
	},		

	/**
	 * Method: digitizeStop
	 * Interrompe (annulla) la digitalizzazione (invocata dalle onDigitizeStartAddSub etc.)
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeStop: function (geomType){

		switch (geomType) {
	   		case geomTypePoint:
	   			this.viewer.pluginStopDigitizePoint(geomType);
	   		break;
	   		case geomTypeLine:
	   			this.viewer.pluginStopDigitizeLine(geomType);
	   		break;
	   		case geomTypePolygon:
	   			this.viewer.pluginStopDigitizePolygon(geomType);
	   		break;
	   		case geomTypeCircle:
	   			this.viewer.pluginStopDigitizeCircle(geomType);
	   		break;

	   	}
	},
				
	/**
	 * Method: digitizeByCADStart
	 * Inizia la digitalizzazione (invocata dalle onDigitizeByCADStart etc.)
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeByCADStart: function (geomType){

		switch (geomType) {
	   		case geomTypePoint:
	   			//this.viewer.pluginStartDigitizePointFromRef(geomType);
	   			this.viewer.pluginStartDigitizePointByCAD(geomType);
	   		break;
	   		case geomTypeLine:
	   			this.viewer.pluginStartDigitizeLineByCAD(geomType);
	   		break;
	   		case geomTypePolygon:
	   			this.viewer.pluginStartDigitizePolygonByCAD(geomType);
	   		break;
	   		default:
	   			Ext.Msg.alert('Attenzione', 'La digitalizzazione con il CAD non &egrave; prevista per questo tipo di geometria');
	   		break;
	   	}
	},
	
	/**
	 * Method: digitizeByCADStop
	 * Interrompe (annulla) la digitalizzazione per mezo di CAD
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeByCADStop: function (geomType){

		switch (geomType) {
	   		case geomTypePoint:
	   			//this.viewer.pluginStopDigitizePointFromRef(geomType);
	   			this.viewer.pluginStopDigitizePointByCAD(geomType);
	   		break;
	   		case geomTypeLine:
	   			this.viewer.pluginStopDigitizeLineByCAD(geomType);
	   		break;
	   		case geomTypePolygon:
	   			this.viewer.pluginStopDigitizePolygonByCAD(geomType);
	   		break;
	   		case geomTypeCircle:
	   			Ext.Msg.alert('Attenzione', 'La digitalizzazione con il CAD non &egrave; prevista per questo tipo di geometria');
	   		break;

	   	}
	},

	/**
	 * Method: digitizeStartVertexEditing
	 * Inizia la modifica dei vertici.
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeStartVertexEditing: function (geomType){

		this.viewer.pluginStartVertexEditing(geomType, this.getCurrentSelectLayer().codTPN);

	},

	/**
	 * Method: digitizeStopVertexEditing
	 * Ferma (annulla) la modifica dei vertici.
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeStopVertexEditing: function (geomType){

		this.viewer.pluginStopVertexEditing(geomType);

	},

	/**
	 * Method: digitizeStartDragDrop
	 * Inizia lo spostamento di un oggetto.
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeStartDragDrop: function (geomType){

		this.viewer.pluginStartDragDrop(geomType);
	},

	/**
	 * Method: digitizeStopDragDrop
	 * Ferma (annulla) lo spostamento di un oggetto.
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeStopDragDrop: function (geomType){

		this.viewer.pluginStopDragDrop(geomType);
	},

	/**
	 * Method: digitizeStopVertexEditing
	 * Ferma (annulla) l'editing dei vertici di un oggetto.
	 *
	 * Parameters:
	 * geomType - {} il tipo di geometria definito.
	 */
	digitizeStopVertexEditing: function (geomType){

		this.viewer.pluginStopVertexEditing(geomType);
	},

	/**
	 * Method: getAzioniEventi
	 * Ritorna la sezione AzioniEventi specifica di eventoLayer e del tipoLayer passati come parametro
	 *
	 * Parameters:
	 * eventoLayer - {} eventoLayer
	 * tipoEvento - {} tipoEvento
	 * idBtn - {} idBtn
	 *
	 * Returns:
	 *  {<AzioniEventi>} la sezione AzioniEventi specifica.
	 */
	getAzioniEventi: function (eventoLayer, tipoEvento, idBtn) {
		var azioniEventi = null;
		
		if (eventoLayer) {
			switch (tipoEvento) {
			  case (this.eventVis):
			  		azioniEventi = eventoLayer.azioniEventiVis;
			  		break;
			  case (this.eventCanc):
			  		azioniEventi = eventoLayer.azioniEventiCanc;
			  		break;
			  case (this.eventUpdateGeom):
			  		azioniEventi = eventoLayer.azioniEventiUpdateGeom;
			  		break;
			  case (this.eventUpdateAlpha):
			 		azioniEventi = eventoLayer.azioniEventiUpdateAlpha;
			  		break;
			  case (this.eventIns):
			  		azioniEventi = eventoLayer.azioniEventiIns;
			  		break;
			  case (this.eventRicerca):
			  		azioniEventi = eventoLayer;
			  		break;
		      case (this.eventCustomButton):		      		
			      	var azCbList = eventoLayer.azioniEventiCustomButtonList.customButtonList;
					for (var i=0; i<azCbList.length; i++) {
						if (azCbList[i].idCustomButton == idBtn) {
							azioniEventi = azCbList[i];
							// parametro che mi dice se l'azione � sul layer o globale
							if(azioniEventi)
								azioniEventi.isOfTheLayer = true;						
							break;
						}
					}
					if (!azioniEventi) {
						// se non definito a livello di layer/evento cerca su definizione globale bottoni
						var azCbList = this.paramsJS.layOut.customButtonList;
						for (var i=0; i<azCbList.length; i++) {
							if (azCbList[i].idCustomButton == idBtn) {
								azioniEventi = azCbList[i].azioniEventiCustomButton;
								// parametro che mi dice se l'azione � sul layer o globale
								if(azioniEventi)
									azioniEventi.isOfTheLayer = false;
								break;
							}
						}
					}
					
			  		break;
			}
		}
		
		return azioniEventi;
	},

	// TODO
	// - gestire in doEventActions chiudiSuDblClick e togliere da onIdentify
	// - gestire pluginRefreshMappa quando necessario (adesso lo fa sempre dopo l'ultimo passo)
	// - gestione parametri da uno step all'altro?
	// - gestione errori ajax
	/**
	 * Method: doEventActions
	 * Si occupa di eseguire le azioni previste per l'evento ed il layer specifici
	 * le azioni ajax sono eseguite in maniera sincrona (attesa della fine prima di passare alla successiva) 
	 * mentre le altre sono eseguite in maniera asincrona (senza attesa della fine) fino alla successiva ajax.
	 * N.B. Ricordarsi in caso di aggiunta di parametro di gestire anche all'interno dove vengono settati sulla funzione
	 * di callback e nella funzione di callback stessa e doEventActionsAjaxFailure
	 *
	 * Parameters:
	 * eventoLayer - {} corrispondente JS della classe parametriEventiLayer
	 * tipoEvento - {} tipo di evento che si e' verificato. Valori possibili sono quelli previsti per le costanti che indicano il tipo di evento
	 * keyValue - {} chiave dell'oggetto al quale si riferisce l'azione
	 * nStep - {} numero del passo. Nelle chiamate ajax la funzione termina per essere richiamata 
	 *            dalla funzione di callback ajax passando in questo parametro il passo al quale si � arrivati e consentendo quindi di andare avanti
	 * nextActionObj - {} oggetto contenente i parametri per l'eventuale azione di redirect. Una azione di redirect � caratterizzata dal fatto di avere
	 *   		          il flag redirect=true. Quando questo si verifica viene fatta redirect (tenendo conto di ajaxCall e traget) all'url definita in redirectUrl 
	 * 			          se definito oppure nel parametro nextActionObj.redirectUrl. Il contenuto del parametro nextActionObj.parameters viene in ogni caso
	 * 			          aggiunto ai parametri di chiamata dell'azione successiva (anche se non � una redirect)
	 * nSubEvento - {} umero di sottoevento, per esempio numero di ricerca, di custombutton etc. Indica la posizione nell'array.
	 * oggetto - {JSGeometry} oggetto al quale si riferisce l'azione
	 */
	doEventActions: function (eventoLayer, tipoEvento, keyValue, nStep, nextActionObj, idBtn, oggetto) {

		if ((nStep == null) || (nStep == undefined)) nStep = -1;
		
		nStep++;
		
		var azioniEventi = this.getAzioniEventi(eventoLayer, tipoEvento, idBtn);
		var bLastAction = (nStep==azioniEventi.azioneList.length);
		var azione = null;
		
		if (azioniEventi) {
			var bExit = false;
			if (azioniEventi.azioneList) {
				while ( (nStep<azioniEventi.azioneList.length) && !bExit ) {
					azione = azioniEventi.azioneList[nStep];
					
					var url;
					var urlcompleta;
					
					 
					
					// definizione url
					/*
					if (azione.redirect) {
						if (nextActionObj.redirectUrl) {
							url = nextActionObj.redirectUrl;
						} else {
							url = azione.redirectUrl;
						}
					} else {
						url = azione.url;
					}
					*/
					
					if (azione.redirect) {
						if (nextActionObj.redirectUrl) {
							url = nextActionObj.redirectUrl;
						} else {
							url = azione.redirectUrl;
						}
					} else {
						// if (azione.useWMSGetFeatureInfo && oggetto.getFeatureInfoLink!=undefined && oggetto.getFeatureInfoLink!=null && oggetto.getFeatureInfoLink!="") {
						if (azione.useWMSGetFeatureInfo && oggetto.getFeatureInfoLink) {
							url = oggetto.getFeatureInfoLink;
							this.clearHighLigthed();
							if (oggetto.relatedGeoms!=undefined && oggetto.relatedGeoms!=null) this.addHighlighted(oggetto.relatedGeoms, false);
						} else { 						
							url = azione.url;
						}
					}
					
					if(!url) {
						
						this.fireEvent('visualize', eventoLayer.codTPN, keyValue);
						
					} else {
					
						/*
						// sostituzione dei valori #JS{} presenti nel tag <url> del file di preset						
						stringEx = /#JS{{1}[A-Z,a-z,0-9,_,., \/]*}/;
					    stringExInit= /^#JS{{1}/;
						stringExEnd= /}/;
						newJSUrl='';
						if (stringEx.test(url)) {
						   initStringIndex= url.search(stringExInit)+ 4;
						   endStringIndex= url.search(stringExEnd);
						   value= url.substring(initStringIndex, endStringIndex);
						   newJSUrl= url.replace(stringEx, eval(value));
						   url= newJSUrl;
						}
						*/
						
						// sostituzione dei valori #JS{} presenti nel tag <url> del file di preset
						var stringEx     = /#JS{{1}[A-Z,a-z,0-9,_,',",.,:,\?,=,!,<,>,\*,\(,\),\[,\],\^, \/]*}/;
					    var stringExInit = /#JS{{1}/;
						var stringExEnd  = /}/;
						var newJSUrl     = url;
						var suburl       = url;
						while (stringEx.test(suburl)) {
							
						   var initStringIndex = suburl.search(stringExInit);
						   var endStringIndex  = suburl.search(stringExEnd);
						   var name			   = suburl.substring(initStringIndex, endStringIndex+1);
						   var value           = suburl.substring(initStringIndex+4, endStringIndex);
						   newJSUrl			   = newJSUrl.replace(name, eval(value));
						   suburl 			   = (endStringIndex+2 <= suburl.length) ? suburl.substring(endStringIndex+2): "";
						   
						}
						url= newJSUrl;
						
						var questionMark = (url.indexOf("?") == -1) ? "?" : "";			
						urlcompleta = url + questionMark + "&" +  "IDTPN=" + escape(keyValue) + '&codTPN=' + escape(eventoLayer.codTPN);
						
						this.condizioneListToPostVar(azioniEventi);
						
						if((azione.forward != null) && (azione.forward != "")){
							urlcompleta += '&forward=' + escape(azione.forward);
						}
						
						if((azione.command != null) && (azione.command != "")){
							urlcompleta += '&command=' + escape(azione.command);
						}
						
						if((nextActionObj) && (nextActionObj.parameters!=null) && (nextActionObj.parameters!="")){
							for (var i=0; i<nextActionObj.parameters.length; i++){
								urlcompleta += '&' + nextActionObj.parameters[i].key + "=" + escape(nextActionObj.parameters[i].value);
							}
							//urlcompleta += '&' + escape(nextActionObj.parameters);
						}
						
						var method = (azione.method || 'POST').toUpperCase(); 
						
						if (!azione.ajaxCall) {
							// azione normale (non ajax)
							if (azione.noTolomeoDefaultParams) 
								this.openURL (url, azione.target, method, azione.noTolomeoDefaultParams);
							else
								this.openURL (urlcompleta, azione.target, method);
						} else {
							// azione ajax
							// � bloccante (si aspetta la fine per proseguire negli step
							// per questo bexit e' posto a true
							
							//salvataggio parametri per successivo passo da callback
							this.doEventActionsAjaxCallback.eventoLayer = eventoLayer;
							this.doEventActionsAjaxCallback.tipoEvento	= tipoEvento;
							this.doEventActionsAjaxCallback.keyValue	= keyValue;
							this.doEventActionsAjaxCallback.nStep		= nStep;
							this.doEventActionsAjaxCallback.idBtn		= idBtn;
							this.doEventActionsAjaxCallback.oggetto		= oggetto;
							
							//Chiamata ajax
							var ajaxOptions = {
								method: method,								
								url: urlcompleta,
								params: {
									geoOp: this.geoOpField.getValue(), 									
									geoCoord: method == 'POST' ? this.geoCoordField.getValue() : null,
									selectedList: this.selectedListField.getValue(),
									SRID: this.paramsJS.mappe.SRID,
									clippingCodTPN: eventoLayer.clippingCodTPN
								},
								scope: this,
								success: this.doEventActionsAjaxCallback,
								failure: this.doEventActionsAjaxFailure
							}
										
							if (azione.crossDomainAjax) {
								// Aggiunta parametro format='ext' in richiesta
								ajaxOptions.params.format = 'ext';
								new TolomeoExt.ToloCrossAjax().request(ajaxOptions);
							} else {
								Ext.Ajax.request(ajaxOptions);
							}
							bExit = true;
						}
					}
					nStep++;
			
				
				}
				if ( bLastAction || 
				     (azione!=null && !azione.ajaxCall && nStep>=azioniEventi.azioneList.length )) {
					// dopo ultima azione...
					if (azioniEventi.refreshAtTheEnd) {
						this.viewer.pluginRefreshMap();
					}
					if (azioniEventi.closeAtTheEnd) {
						window.close();
					}
					
					switch (tipoEvento) {
					  case (this.eventVis):
	
					  		break;
					  case (this.eventCanc):
					  		this.clearSelected(false, eventoLayer.codTPN);
				  			this.refreshSelected();
					  		break;
					  case (this.eventUpdateGeom):
						  	this.refreshSelected();
					  		break;
					  case (this.eventUpdateAlpha):
						  	this.refreshSelected();
					  		break;
					  case (this.eventIns):
						  	this.refreshSelected();
					  		break;
					  case (this.eventRicerca):
					  		break;
					  		
					}
			
				}
			}
		}
		
		if ((azioniEventi.azioneList.length==0) || (nStep>=azioniEventi.azioneList.length)) {
				// dopo ultima azione...anche se non ci sono azioni definite
				this.eventActionsEnd(keyValue, eventoLayer.codTPN);
		}
				
	},
	
	/**
	 * Eseguita a fine azioni.
	 *  - se definiti i campi di una form per ricevere i valori a fine azione provvede a settarli
	 *  - lancia l'evento actionsEnd 
	 * @param {String} keyValue
	 * @param {String} codTPN
	 */
	eventActionsEnd: function(IDTPN, codTPN) {
		
		var values = { geoOp: this.geoOpField.getValue(),
					   geoCoord: this.geoCoordField.getValue(),
					   selectedList: this.selectedListField.getValue(),
					   IDTPN: IDTPN,
					   codTPN: codTPN};
					   
		
		if (this.actionsEndReturnFields) {
        	for(var fieldName in this.actionsEndReturnFields){
        		if(this.actionsEndReturnFields[fieldName]){
        			var domField = Ext.fly(this.actionsEndReturnFields[fieldName]);
        			if(domField) domField.dom.value =  values[fieldName];
        		}
        	}
        }
        
        this.fireEvent("actionsEnd", values);
		
	},
	
	/**
	 * Eseguita quando una feature digitalizzata viene in un secondo momento modificata
	 * 
	 */
	digitizedFeatureModifyEnd: function(geom) {
		
		//TODOH Attenzione che l'utente potrebbe aver cambiato layer attivo!!!
		var	layer = this.getCurrentSelectLayer();
		
		geom.codTPN = layer.codTPN;
		geom.SRID = this.paramsJS.mappe.SRID;
		
		this.geometryToPostVar(geom);
		var domField = Ext.fly(this.actionsEndReturnFields['geoCoord']);
		if(domField) domField.dom.value =  this.geoCoordField.getValue();
        
		
		/* Se faccio cos� fa validazione ma se validazione non passa sparisce il punto
		 * this.currentDigitizeOperation = this.digitizeOperationInsert;
		this.onDigitizeEndGeometry(geom);
		
		 */
        this.fireEvent("digitizedFeatureModifyEnd", geom);
		
	},

	/**
	 * Method: doEventActionsAjaxCallback
	 * Funzione di callback per le chiamate ajax effettuate dalla funzione doEventActions. 
	 * Recupera i parametri e richiama doEventActions per effettuare il passo successivo.
	 *
	 * Parameters:
	 * transport - {} transport
	 */
	doEventActionsAjaxCallback: function (records, store, originalOptions) {
		// recupero eventuali parametri di ritorno ajax e gestione (passaggio ai successivi? 
		// TODO ALE var response = eval('(' + transport.responseText + ')');	
		var nextActionObj;
		// TODO ALE if (response) {
		// TODO ALE 	nextActionObj = response.nextAction;
		// TODO ALE }
		
		var tipoEvento = this.doEventActionsAjaxCallback.tipoEvento;
		var eventoLayer = this.doEventActionsAjaxCallback.eventoLayer
		var idBtn = this.doEventActionsAjaxCallback.idBtn;
		var nStep = this.doEventActionsAjaxCallback.nStep;
		var oggetto = this.doEventActionsAjaxCallback.oggetto;
		
		//var azioniEventi = this.getAzioniEventi(eventoLayer, tipoEvento, idBtn);
		//var azione = azioniEventi.azioneList[nStep];
		
		
		// Lancia l'evento. Se l'evento non � crossDomain records contiene trasport della chiamata normale e store non c'e'
		this.fireEvent("onEventActionAjaxSuccess", eventoLayer, tipoEvento, idBtn, nStep, records, store, oggetto);
		
		// Richiama doEventActions per eventuali step successivi
		// ripassandogli i parametri che erano stati salvati 
		this.doEventActions(eventoLayer,
							tipoEvento,
							this.doEventActionsAjaxCallback.keyValue,
							nStep,
							nextActionObj,
							idBtn,
							oggetto);
					   
	},

	/**
	 * Method: doEventActionsAjaxFailure
	 * Comunica l'errore, recupera i parametri e richiama doEventActions per effettuare il passo successivo.
	 *
	 * Parameters:
	 * transport - {} transport
	 */
	doEventActionsAjaxFailure: function (records, store, originalOptions) {
		this.showAjaxError(records);
		var nextActionObj;
		//ALE TODO
		// recupero eventuali parametri di ritorno ajax e gestione (passaggio ai successivi? 
		
		var tipoEvento = this.doEventActionsAjaxCallback.tipoEvento;
		var eventoLayer = this.doEventActionsAjaxCallback.eventoLayer
		var idBtn = this.doEventActionsAjaxCallback.idBtn;
		var nStep = this.doEventActionsAjaxCallback.nStep;
		var oggetto = this.doEventActionsAjaxCallback.oggetto;
		
		// Lancia l'evento. Se l'evento non � crossDomain records contiene trasport della chiamata normale e store non c'e'
		this.fireEvent("onEventActionAjaxFailure", eventoLayer, tipoEvento, idBtn, nStep, records, store, oggetto);
		
		// Richiama doEventActions per eventuali step successivi
		// ripassandogli i parametri che erano stati salvati 
		this.doEventActions(this.doEventActionsAjaxCallback.eventoLayer,
				this.doEventActionsAjaxCallback.tipoEvento,
				this.doEventActionsAjaxCallback.keyValue,
				this.doEventActionsAjaxCallback.nStep,
				nextActionObj,
				this.doEventActionsAjaxCallback.idBtn,
				this.oggetto);
					   
	},
	
	/**
	 * Method: openURLRaw
	 *
	 * Parameters:
	 * url - {String} url su cui fare il submit
	 * target - {String} target sul quale aprire la url
	 * noTolomeoDefaultParams - {boolean} indica se includere o meno i parametri di default di tolomeo (attivo solo con method=GET
	 * 
	 */
	openURLRaw: function(url, target, method, noTolomeoDefaultParams) {
		
		var form = this.submitForm.getForm();
		//console.log("apro con metodo " + method + " la url " + completeUrl);
				
		if(method && method.toUpperCase() == 'GET'){
			var valuesObj = form.getValues();
			var completeUrl = url;
			completeUrl += (completeUrl.indexOf("?") == -1) ? "?" : "";
			
			if (noTolomeoDefaultParams==null || noTolomeoDefaultParams==false) {
				// si escludono le coordinate per i limiti del get
				for(var i in valuesObj){
					//&&(i != "selectedList")
					if ((i != "geoCoord")){
						completeUrl += "&" + i + "=" + encodeURIComponent(valuesObj[i]);
					}
				}	
			}
			window.open(completeUrl,target);
			
		} else {

			var submitParams = {
	               			method: 'POST',
	               			target: target,
	            			url: url
	               		}
	               		
	        form.submit(submitParams);
	               		
	        /*
			var formDom = form.getEl().dom;
			formDom.action = url;
			formDom.method = 'POST';
			formDom.target = target;		
			form.submit();*/
		}
	},
	
	/**
	 * Method: openURL
	 * Esegue il submit su una certa url e su un determinato target. Nella form sono presenti i campi geoCoord e geoOp.
	 *
	 * Parameters:
	 * url - {String} url su cui fare il submit
	 * target - {String} target sul quale aprire la url
	 * noTolomeoDefaultParams - {boolean} indica se includere o meno i parametri di default di tolomeo (attivo solo con method=GET
	 * 
	 */
	openURL: function (url, target, method, noTolomeoDefaultParams) {
		if(this.fireEvent("beforeOpenUrl", url, target) === false)
			return;
		/*if (target!="pannello")*/
		this.openURLRaw(url, target, method, noTolomeoDefaultParams);
		this.fireEvent("openUrl", url, target);
		
	},

	/**
	 * Method: clearURL
	 * Esegue il submit su una certa url e su un determinato target. Nella form sono presenti i campi geoCoord e geoOp.
	 *
	 * Parameters:
	 * target - {String} target sul quale aprire la url
	 * method - {String} metodo per la chiamata (GET o POST)
	 */
	clearURL: function (target, method) {
		if(this.fireEvent("beforeClearUrl", url, target) === false)
			return;
		var url = (this.paramsJS.azioniApertura.urlPannello) ? this.paramsJS.azioniApertura.urlPannello : this.TOLOMEOStaticRoot + "html/blank.html";
		/*if (target!="pannello")*/
		this.openURLRaw(url, target, method);
		this.fireEvent("clearUrl", url, target);
		
	},
	
	/**
	 * Method: geoOpToPostVar
	 * Setta l'operazione nella form per la trasmissione.
	 *
	 * Parameters:
	 * geoOp - {Ext.form.TextField} geoOp operazione (vedi costanti)
	 */
	geoOpToPostVar: function (geoOp){
		
		this.geoOpField.setValue(geoOp);
		
		//submitForm.geoOp.value = geoOp;
	},

	/**
	 * Method: geometryToPostVar
	 * Setta la geometrie nella form per la trasmissione alla servlet.
	 *
	 * Parameters:
	 * jsGeometry - {JSGeometry} jsGeometry Geometria
	 */
	geometryToPostVar : function (jsGeometry) {
		
		 this.geoCoordField.setValue(jsGeometry)
			
	},	

	/**
	 * Method: condizioneListToPostVar
	 * Setta nella form i valori delle chiavi relative agli oggetti selezionati e richiesti dalla condizioneList 
	 * dell'azioneEvento. Il formato utilizzato e' il seguente.
	 *
	 * <![CDATA[
	 * <condizioneList>
	 * 		<layer>
	 * 			<codTPN>-900</codTPN>
	 * 			<IDTPN>1000</IDTPN>
	 * 			<IDTPN>1002</IDTPN>
	 * 		</layer> 
	 * 		<layer>
	 * 			<codTPN>-1000</codTPN>
	 * 			<IDTPN>12</IDTPN>
	 * 			<IDTPN>13</IDTPN>
	 * 			<IDTPN>112</IDTPN>
	 * 		</layer>
	 * </condizioneList>
	 * ]]>
	 *
	 * dove 
	 *
	 * -900 e -1000 sono i codTPN di due layer indicati nella codnizioneList
	 * 1000 e 1002 sono gli oggetti selezionati appartenenti al layer -900 
	 * 12, 134 e 112 sono gli oggetti selezionati appartenenti al layer -1000 
	 *
	 * Parameters:
	 * azioniEventi - {} azioniEventi
	 */
	condizioneListToPostVar: function (azioniEventi) {
		
		if (azioniEventi.condizioneList) {
			var condList = azioniEventi.condizioneList;
			var condListParam = "<condizioneList>";
			for (var i=0; i<condList.length; i++) {
				var cond = condList[i];
				var selezionati = this.selezioneCorrente.getByCodTPN(cond.codTPN).geometries;
				if ((selezionati!=null) && (selezionati.length>0)) {
					condListParam += "<layer><codTPN>" + cond.codTPN + "</codTPN>" ;
					for (var j=0; j<selezionati.length; j++) {
						condListParam += "<IDTPN>" + selezionati[j].key + "</IDTPN>" ;
					}
					condListParam += "</layer>" ;
				}
			}
			condListParam += "</condizioneList>" ;
		}
		
		this.selectedListField.setValue(condListParam);
		//submitForm.selectedList.value = condListParam;
		
	},

	/**
	 * Method: verifyEventsSelectedConditions
	 *
	 * Parameters:
	 * eventoLayer - {} eventoLayer 
	 * tipoEvento - {} tipoEvento 
	 * nSubEvento - {} nSubEvento
	 */
	verifyEventsSelectedConditions: function (eventoLayer, tipoEvento, nSubEvento) {
		return this.eventsSelectedConditionsfullCheck(eventoLayer, tipoEvento, nSubEvento).ok;
	}, 

	/**
	 * Method: messageEventsSelectedConditions
	 *
	 * Parameters:
	 * eventoLayer - {} eventoLayer 
	 * tipoEvento - {} tipoEvento 
	 * nSubEvento - {} nSubEvento
	 */
	messageEventsSelectedConditions: function (eventoLayer, tipoEvento, nSubEvento) {
		return this.eventsSelectedConditionsfullCheck(eventoLayer, tipoEvento, nSubEvento).disabledMessage;	
	},

	/**
	 * Method: eventsSelectedConditionsfullCheck
	 * Verifica se sono rispettate le condizioni per abilitare un certo evento 
	 * (limitatamente agli oggetti selezionati) ed il messaggio con le motivazioni se le condizioni non siano rispettate 
	 * contiene il messaggio con le motivazioni. Ogni motivazione viene aggiunta alla precedente.
	 *
	 * Parameters:
	 * eventoLayer - {} eventoLayer 
	 * tipoEvento - {} tipoEvento 
	 * nSubEvento - {} nSubEvento
	 */
	eventsSelectedConditionsfullCheck: function (eventoLayer, tipoEvento, nSubEvento) {
		var ret = true;
		var disabledMessage = "";
		
		var azioniEventi = this.getAzioniEventi(eventoLayer, tipoEvento, nSubEvento);
		
		switch (tipoEvento) {
			 case (this.eventVis):
			 case (this.eventCanc):
			 case (this.eventUpdateGeom):
			 case (this.eventUpdateAlpha):
			
				   // verifica se selezionato un oggetto del corrispondente codTPN
				   // Tolto per consentire corretto funzionamento 
				   if (eventoLayer && !this.selezioneCorrente.ContainsCodTPN(eventoLayer.codTPN)) {
				   		disabledMessage += "Per il layer attivo non e' stato selezionato alcun oggetto \n";	
				   		ret=false;
				   }
				   break;
			 case (this.eventCustomButton): 
			 /*
			 	if(nSubEvento==-1) {
			 		ret = true;
			 		break;
			 	}
			 */	
			 	// se non ci sono azioni eventi non si fa apparire il pulsante
			 	if(!azioniEventi) {
			 		ret = false;
			 	// se l'azione � del layer e non global si richiede la selezione di almeno un elemento del layer
			 	}else if (azioniEventi.isOfTheLayer && !this.selezioneCorrente.ContainsCodTPN(eventoLayer.codTPN)) {
				   	disabledMessage += "Per il layer attivo non e' stato selezionato alcun oggetto \n";	
				   	ret=false;
				} 
			 break;
			 case (this.eventIns):	break;
			 case (this.eventRicerca): break;
		}
		
		// In tutti i casi devono essere verificate le condizioni aggiuntive se presenti
		if (azioniEventi && azioniEventi.condizioneList) {
			var condList = azioniEventi.condizioneList;
			for (var i=0; i<condList.length; i++) {
				var cond = condList[i];
				if (!this.selezioneCorrente.ContainsCodTPN(cond.codTPN)) {
					disabledMessage += "Per eseguire l'azione occorre anche selezionare un oggetto del layer " + cond.nomeLayer + "\n"	
					ret=false;
				}
			}
		}
		
		return {ok: ret, disabledMessage: disabledMessage} ;
	},
	
	/**
	 * Method: enablePermittedOp
	 *
	 * Parameters:
	 * opCode - {} opCode 
	 * bPermitted - {} bPermitted 
	 */
	enablePermittedOp: function(opCode, bPermitted) {
		eventName = (bPermitted ? 'onOperationEnable' : 'onOperationDisable' );
		this.fireEvent(eventName, opCode);
	},
	
	/**
	 * Method: togglePermittedOperations
	 * Modifica lo stato delle icone per renderlo coerente con le operazioni possibili in funzione dell'oggetto selezionato e del layer
	 * Tipo di editing singolo attivo. Valori possibili:
	 *  0 - nessun editing singolo 
	 *  1 - inserimento completo   
	 *  2 - inserimento di sola geometria
	 *  3 - modifica geometria
	 *
	 *  Se editingJSGeometry==null  -> inserimento completo di oggetto con layerCODTPN e valorechiave. Per effettuare l'inserimento vengono invocate 
	 *  le stesse azioni previste per l'inserimento normale
	 *  se editingJSGeometry!=null ma con geometria nulla -> viene abilitato l'inserimento della geometria, ma l'azione risultante sar� la stessa di una updateGeom
	 *  se editingJSGeometry!=null e con geometria non nulla -> vengono abilitate le azioni di update sulla geometria
	 */	 
	//TODO
	togglePermittedOperations: function () {

		var selLayer = this.getCurrentSelectLayer();
		var sctpn = this.paramsJS.getSelectableCodTPN();
		var withSnap = false;		
		
		// se nessun layer selezionato nascondi bottone di selezione
		this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnSeleziona, sctpn && sctpn.length > 0);

		var tipoEditingSingolo;
		
		// Stabilisco in quale modalit� sono
		if ((this.paramsJS.azioniApertura.modoEditingSingolo != null) && (this.paramsJS.azioniApertura.modoEditingSingolo != "")) {
			if ((this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!=null) && 
				(this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry!="")) {
				var geoms = new JSGeometryArray();
				geoms.FromUntypedArray(this.paramsJS.azioniApertura.modoEditingSingolo.editingJSGeometry);
				if ((geoms.geometries.length==1) && (geoms.geometries[0].geometry!="")) {
					tipoEditingSingolo = 3;  // 3 - modifica geometria	
				} else {
					tipoEditingSingolo = 1;  // 2 - inserimento di sola geometria	
				} 	
			} else {
				tipoEditingSingolo = 1;  // 1 - inserimento completo  
			}
		} else {
			tipoEditingSingolo = 0; 	// 0 - nessun editing singolo
		}
		//selLayer.azioniEventiIns.noAction || selLayer.azioniEventiIns.azioneList.length
		if (selLayer && (selLayer.azioniEventiIns.forceEnable || selLayer.azioniEventiIns.azioneList.length!=0) && this.verifyEventsSelectedConditions(selLayer, this.eventIns) &&
			this.bEditingSingoloInsertDone == false &&
			(tipoEditingSingolo==0    ||
		     	tipoEditingSingolo==1 ||
		     	tipoEditingSingolo==2))  {
			//TODO
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnNuovo, true);
			
			withSnap = true;

		} else {
			//TODO
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnNuovo, false);
			// TODO var disMess = messageEventsSelectedConditions(selLayer, eventIns);
			// TODO if (disMess!="") bottoni[btnNuovo].disabledMessage ;
			
		}
		//selLayer.azioniEventiCanc.azioneList.length != 0
		if (selLayer && (selLayer.azioniEventiCanc.forceEnable || selLayer.azioniEventiCanc.azioneList.length != 0 ) && this.verifyEventsSelectedConditions(selLayer, this.eventCanc) && (tipoEditingSingolo == 0) ) {
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnDelete, true);
			//bottoni[btnDelete].setEnabled(true);
		} else {
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnDelete, false);
			//bottoni[btnDelete].setEnabled(false);
			// TODO var disMess = messageEventsSelectedConditions(selLayer, eventCanc);
			//TODO if (disMess!="") bottoni[btnDelete].disabledMessage = disMess;
		}  
		//selLayer.azioniEventiUpdateGeom.azioneList.length != 0
		if (selLayer && (selLayer.azioniEventiUpdateGeom.forceEnable || selLayer.azioniEventiUpdateGeom.azioneList.length != 0 ) && 
			 this.verifyEventsSelectedConditions(selLayer, this.eventUpdateGeom) && 
			 ((tipoEditingSingolo == 0) || 
			  (tipoEditingSingolo == 3  )))  {
			if (selLayer.copertura) {
				this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnAdd, false);
				this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnSubtract, false);
				this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnVertexEdit, false);
				this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnAddSub, true);

				// TODO bottoni[btnAdd].disabledMessage = "Funzione non disponibile su layer di tipo copertura";
				// TODO bottoni[btnSubtract].disabledMessage = "Funzione non disponibile su layer di tipo copertura";
				// TODO bottoni[btnAddSub].disabledMessage = "Funzione non disponibile su layer di tipo copertura";
				// TODO bottoni[btnVertexEdit].disabledMessage = "Funzione non disponibile su layer di tipo copertura";
				
			} else {
				if (selLayer.azioniEventiUpdateGeom.conAdd) this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnAdd, true); //bottoni[btnAdd].setEnabled(true);
					else this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnAdd, false); //bottoni[btnAdd].setEnabled(false);
				if (selLayer.azioniEventiUpdateGeom.conSubtract) this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnSubtract, true);  //bottoni[btnSubtract].setEnabled(true);
					else this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnSubtract, false); //bottoni[btnSubtract].setEnabled(false);
				this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnAddSub, false); //bottoni[btnAddSub].setEnabled(false);
				if (selLayer.azioniEventiUpdateGeom.conVertexEditing) this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnVertexEdit, true); //bottoni[btnVertexEdit].setEnabled(true);
					else this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnVertexEdit, false); // bottoni[btnVertexEdit].setEnabled(false);
				if (selLayer.azioniEventiUpdateGeom.conDragDrop) this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnDragDrop, true); //bottoni[btnDragDrop].setEnabled(true);
					else this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnDragDrop, false); //bottoni[btnDragDrop].setEnabled(false);
			}
			
			withSnap = true;			
			
		} else {
			// TODO var disMess = messageEventsSelectedConditions(selLayer, this.eventUpdateGeom);
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnAdd, false);
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnSubtract, false);
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnAddSub, false);
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnVertexEdit, false);
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnDragDrop, false);
			
			//TODO if (disMess!="") bottoni[btnAdd].disabledMessage = disMess;
			//TODO if (disMess!="") bottoni[btnSubtract].disabledMessage = disMess;
			//TODO if (disMess!="") bottoni[btnAddSub].disabledMessage = disMess;
			//TODO if (disMess!="") bottoni[btnVertexEdit].disabledMessage = disMess;
			//TODO if (disMess!="") bottoni[btnDragDrop].disabledMessage = disMess;
		} 
		//selLayer.azioniEventiUpdateAlpha.azioneList.length != 0
		if (selLayer && ((selLayer.azioniEventiUpdateAlpha.forceEnable || selLayer.azioniEventiUpdateAlpha.azioneList.length != 0 ) && this.verifyEventsSelectedConditions(selLayer, this.eventUpdateAlpha)) && (tipoEditingSingolo == 0)) {
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnUpdateAlfa, true);
			//bottoni[btnUpdateAlfa].setEnabled(true);
		} else {
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnUpdateAlfa, false);
			//bottoni[btnUpdateAlfa].setEnabled(false);
			//TODO if (disMess!="") bottoni[btnUpdateAlfa].disabledMessage = messageEventsSelectedConditions(selLayer, eventUpdateAlpha);
		}
		
		//if ((selLayer.azioniEventiVis.azioneList.length != 0) && bSelectedObjectLayerOK &&  (tipoEditingSingolo == 0)) {
		//selLayer.azioniEventiVis.azioneList.length != 0
		if (selLayer &&  (selLayer.azioniEventiVis.forceEnable || selLayer.azioniEventiVis.azioneList.length != 0) && this.verifyEventsSelectedConditions(selLayer, this.eventVis) &&  (tipoEditingSingolo == 0)) {
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnIdentify, true);
			//bottoni[btnIdentify].setEnabled(true);
		} else {
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnIdentify, false);
			// bottoni[btnIdentify].setEnabled(false);
			//TODO if (disMess!="") bottoni[btnIdentify].disabledMessage = messageEventsSelectedConditions(selLayer, eventVis);
		}  
		
		if(selLayer && selLayer.snappable && withSnap){
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnSnap, true);
		} else {
			this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnSnap, false);
		}	
		
		// CustomButtons TODO
		/* TODO TUTTO 
		for (var i=btnCustomBase; i<bottoni.length; i++) {
			var cb = bottoni[i];

				if  (selLayer && verifyEventsSelectedConditions(selLayer, eventCustomButton, cb.idCustomButton)  ) {
					cb.setEnabled(true);
				} else {
					cb.setEnabled(false);
					var disMess = messageEventsSelectedConditions(selLayer, eventCustomButton, cb.idCustomButton);
					if (disMess!="") cb.disabledMessage = disMess;
				}
		}
		*/
		
		for (var i = 0; i < this.paramsJS.layOut.customButtonList.length; i++) {
			var cb = this.paramsJS.layOut.customButtonList[i];
				if  (selLayer && this.verifyEventsSelectedConditions(selLayer, this.eventCustomButton, cb.idCustomButton)  ) {
					this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnCustomBase + i, true);
					//cb.setEnabled(true);
				} else {
					this.enablePermittedOp(TolomeoExt.ToloAPIOpCodes.btnCustomBase + i, false);
					//cb.setEnabled(false);
					//var disMess = messageEventsSelectedConditions(selLayer, eventCustomButton, cb.idCustomButton);
					//if (disMess!="") cb.disabledMessage = disMess;
				}
		}
		  
		
	},

	/**
	 * Method: onChangeFromChoice
	 * Quando in fase di select sono presenti pi� oggetti e viene richiesta la scelta all'utente. Questa funzione viene chiamata quando la scelta cambia.
	 *
	 * Parameters:
	 * geom - {} la geometria. 
	 */
	onChangeFromChoice: function (geom){
		var geoms = new JSGeometryArray();
		geoms.geometries[0] = geom;
		this.addHighlighted(geoms);
	},
	
	/**
	 * Method: onSelectedFromChoice
	 * Quando in fase di select sono presenti pi� oggetti e viene richiesta la scelta all'utente. Questa funzione viene chiamata quando la scelta � stata effettuata.
	 *
	 * Parameters:
	 * geom - {} la geometria. 
	 */
	//TODO
	onSelectedFromChoice: function (geom,addToSelected,visualize) {
		
		this.clearHighLigthed(false);
		var combobox = document.getElementById("scelta");
		
		if (this.autoCloseChoiceWindow && this.selectedChoiceWindow) this.selectedChoiceWindow.close();
		
		var geoms = new JSGeometryArray();
		geoms.geometries[0] = geom; 
		
		this.addSelected(geoms,addToSelected,visualize);
	},

	/**
	 * Method: updateZoomToScale
	 * Aggiorna il valore della scala nel giusto campo.
	 *
	 * Parameters:
	 * scale - {} il valore di scala. 
	 */
	updateZoomToScale: function (scale){
		// TODO da provare la sostituzione con Ext
		Ext.get('scaleinput').value = Math.round(scale);
		//$('scaleinput').value = Math.round(scale);
	},
	
	// Autoidentify - INIZIO
	
	/**
	 * Method: autoIdentifyLayers
	 *
	 */
	autoIdentifyLayers: function () {
		var codTPNStr = "";
		for(var index=0; index<this.paramsJS.azioniEventi.eventiLayerList.length; index++) {
			var paramJSLayer = this.paramsJS.azioniEventi.eventiLayerList[index];
			if (paramJSLayer.autoIdentifyAllowed==true)  {
				if (this.TOCPanel.layerIsVisible(paramJSLayer.codTPN)==true) {
					codTPNStr += (codTPNStr!="") ? "," : "";
					codTPNStr += paramJSLayer.codTPN;
				}
			}
		}
		return codTPNStr;
	},

	/**
	 * Method: autoIdentifyLayersPresent
	 *
	 */
	autoIdentifyLayersPresent: function (){
		return (this.autoIdentifyLayers()=="") ? false : true;
	},

	/**
	 * Method: autoIdentifyLayersWithHighlight
	 *
	 * Parameters:
	 * codTPN - {} codTPN 
	 */
	autoIdentifyLayersWithHighlight: function (codTPN){
		var retVal = false;
		for(var index=0; index<this.paramsJS.azioniEventi.eventiLayerList.length; index++) {
			var paramJSLayer = this.paramsJS.azioniEventi.eventiLayerList[index];
			if ((paramJSLayer.autoIdentifyAllowed) && (paramJSLayer.autoIdentifyWithHighlight) && (
					(paramJSLayer.codTPN==codTPN) || (codTPN==undefined))) {
				retVal = true;
				break;
			}
		}
		return retVal;
	},

	/**
	 * Method: onAutoIdentify
	 *
	 * Parameters:
	 * point - {} il punto. 
	 * mouseX - {} coordinata x del mouse. 
	 * mouseY - {} coordinata y del mouse.
	 *  
	 */
	onAutoIdentify: function (point, mouseX, mouseY, mapXPixel, mapYPixel) {

		// raggio di tolleranza 6 pixel
		var tolleranceRange = this.viewer.pluginGetResolution() * 6;
			
		// Creazione elenco layer da interrogare
		var codTPNStr = this.autoIdentifyLayers();
		
		var mousePos = new Object();
		mousePos.mouseX = mouseX;
		mousePos.mouseY = mouseY;
		
		if (codTPNStr!="") {
			var bounds = this.viewer.pluginGetMapExtent();
			
			// Chiamata Ajax per effettuare l'intersezione e ricevere l'oggetto selezionato
			var ajaxOptions = {
				method: 'post',
				url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxSpatialQueryServlet',
				scope: this,
				mousePos: mousePos,
				params: {
					coordX: point.x, 
					coordY: point.y,
					codTPN: codTPNStr,
					range: tolleranceRange,
					SRID: this.paramsJS.mappe.SRID,
					format: 'ext',
					//Parametri aggiunti per GetFeatureInfo
					bbox:  bounds.left+","+bounds.bottom+","+bounds.right+","+bounds.top ,
					mapwidth:  this.viewer.pluginGetMapWidth()  ,
					mapheight: this.viewer.pluginGetMapViewerHeight() ,
					X: mapXPixel,
					Y: mapYPixel,
					paramPreset: this.paramsJS.nomePreset
				},
				success: this.ajaxAutoIdentifyOK,
				failure: this.showAjaxError 
			}

			// Aggiunta parametri WMS da url
			Ext.apply(ajaxOptions.params, this.paramsJS.urlAdditionalParams);
			new TolomeoExt.ToloCrossAjax().request(ajaxOptions);	
		}
	},

	/**
	 * Method: onAutoIdentifyCancel
	 * Provvede a chiudere la finestra di autoIdentify e fa il clear delle evidenziazioni.
	 *
	 */
	onAutoIdentifyCancel: function () {
		if (this.autoIdentifyWindow)
			this.autoIdentifyWindow.close();
		if (this.autoIdentifyLayersWithHighlight())
			this.clearAutoidentified();
	},

	/**
	 * Method: ajaxAutoIdentifyOK
	 * Funzione di callback per la chiamata ajax onMappaSelect {link #onMappaSelect} che identifica gli oggetti presenti in una certa posizione.
	 *
	 * Parameters:
	 * results - {} results 
	 * store - {} store 
	 * originalOptions - {} originalOptions 
	 */
	ajaxAutoIdentifyOK: function(results, store, originalOptions) {
		
		var geoms = new JSGeometryArray();
		geoms.FromStore(results, store);
		
		if (geoms.geometries.length==0) return;
		var szMessaggio = "";
		szMessaggio += '<ul>';
		for(var index=0; index<this.paramsJS.azioniEventi.eventiLayerList.length; index++) {
			var codTPN = this.paramsJS.azioniEventi.eventiLayerList[index].codTPN;
			var layerDesc = this.paramsJS.azioniEventi.eventiLayerList[index].descrizioneLayer;
			
			var g = geoms.getByCodTPN(codTPN);
			if (g!=null) {
				
				szMessaggio += '<li style="font-weight:bold">' + layerDesc + ':</li>';
				for (var i=0; i < g.geometries.length; i++) {
					szMessaggio += '<li style="margin-left:10px">' + g.geometries[i].description.replace(/\\\"/g,"\"") + '</li>';
				}
				if (this.autoIdentifyLayersWithHighlight(codTPN)) this.addAutoidentified(g);
			}
		}
		szMessaggio += "</ul>";

		if (this.autoIdentifyWindow!=null) this.autoIdentifyWindow.close(); 
		
		this.autoIdentifyWindow = Ext.create('Ext.Window', {
			html: szMessaggio,
			cls: 'clearCSS',
			bodyStyle: 'background-color:white;padding:2px',
			closable: false,
			draggable: false,
			maximizable: false,
			minimizable: false,
			resizable: false, 
			border: false
		}).show();
		
		if (Ext.isIE) {
			this.autoIdentifyWindow.setWidth(350);
		}
		
		var dialogWidth  = this.autoIdentifyWindow.getWidth() ;
		var dialogHeight = this.autoIdentifyWindow.getHeight();
		
		var viewerPos = this.viewer.getPosition();
		var mouseX = originalOptions.mousePos.mouseX - viewerPos[0];
		var mouseY = originalOptions.mousePos.mouseY - viewerPos[1];
		
		var dialogPosX = (mouseX+15+dialogWidth<this.viewer.getWidth()) ? originalOptions.mousePos.mouseX+15 : originalOptions.mousePos.mouseX-15-dialogWidth;
		var dialogPosY = (mouseY+dialogHeight<this.viewer.getHeight())  ? originalOptions.mousePos.mouseY    : originalOptions.mousePos.mouseY-dialogHeight;

		this.autoIdentifyWindow.setPosition(dialogPosX, dialogPosY);
	}, 

	/**
	 * Method: autoIdentifyEnable
	 *
	 * Parameters:
	 * bEnable - {} bEnable 
	 */
	autoIdentifyEnable: function (bEnable) {
		this.viewer.pluginAutoIdentifyEnable(bEnable);
	},
			
	/**
	 * Method: gotoLocationEnable
	 * Inizializza il sistema per l'inserimento delle coordinate da ricercare
	 */
	gotoLocationEnable: function(){
		if(!this.gotoLocWin){
			this.gotoLocWin = new TolomeoExt.ToloGotoLocationWindowExt({projectionCrs: this.projectionCrs, projectionCode: this.getProjectionCode(), id:'gotoLoc',closable: true,closeAction: 'hide'});
			this.gotoLocWin.on('afterlayout',
				function(){
					this.gotoLocWin.centerTo(this.viewer.getEl());
				},this,{single: true});			
			this.gotoLocWin.on('gotoLocation',
				function(x,y,crs){
					// Nel caso di trasformazione ho bisogno delle giuste librerie
					if(crs && crs!= this.getProjectionCode()){
						this.lazyLoadScript(
							'proj4js',
							function(){ this.gotoPosition(x, y, null, true, crs); },
							function(){Ext.Msg.alert('Attenzione', 'Problema nel caricamento delle librerie necessarie per la trasformazione del "sistema di riferimento delle coordinate".<br>E\' possibile utilizzare la funzione solo con il sistema di riferimento <b>' + this.getProjectionCode() + '</b>', function(){this.gotoLocWin.show();},this);},
							this);			
					} else {
						this.gotoPosition(x, y, null, true, crs);
					}
				}, this);
		}
		this.gotoLocWin.show();
			
	},
	
	insertNoteOnMap: function(posX,posY){
		
		Ext.create('Ext.window.Window', {
			layout: 'fit',
			width: 400,
			text: 'Inserimento nota',
			height: 250,
			cls: 'clearCSS',
			items:[{
		    	xtype: 'htmleditor',
		    	cls: 'clearCSS',
		    	//fieldLabel: 'Descrizione',
		    	//height: 100,
		    	//anchor: '99%',
		    	//name: 'descrizione',
		    	//value: this.descrizioneMappa,
		    	enableAlignments: false,
		    	enableFont: true,
		    	enableLinks: true,
		    	enableSourceEdit: true
			}],
			buttons: [
			          { text: 'OK',
			        	toloApi: this,
			        	handler: function() {
			        		var text = this.up('.window').down('htmleditor').getValue();
			        		//text = text.replace(/\n/g, '<br />');
							var viewPos = this.toloApi.getViewerPosition(); 
							var coordinate = this.toloApi.viewer.pluginGetCoordinateFromPixel({x:(posX-viewPos.x),y:(posY-viewPos.y)}); 
							this.toloApi.viewer.pluginAddPopup(coordinate.x,coordinate.y,text,false);
							this.up('.window').close();
			        	}  
			          },
			          {  text: 'Annulla',
			        	 handler: function () { this.up('.window').close(); }
			          }
			          ]
		}).show();
		
		/*
		Ext.Msg.prompt('Nota', 'Inserisci una nota:', function(btn, text){
		    if (btn == 'ok'){
		    	text = text.replace(/\n/g, '<br />');
				var viewPos = this.getViewerPosition(); 
				var coordinate = this.viewer.pluginGetCoordinateFromPixel({x:(posX-viewPos.x),y:(posY-viewPos.y)}); 
				this.viewer.pluginAddPopup(coordinate.x,coordinate.y,text,false);
		    }
		}, this, 50);
		*/
	},
	
	releaseLocationEnable: function(posX,posY,crs){	
		var f = function(){
			var viewPos = this.getViewerPosition(); 
			var coordinate = this.viewer.pluginGetCoordinateFromPixel({x:(posX-viewPos.x),y:(posY-viewPos.y)}); 
			this.releaseCoordinate(coordinate.x,coordinate.y,crs); 
		}
		if(crs == this.getProjectionCode()){
			f.call(this);
		}else{
			this.lazyLoadScript(
				'proj4js',
				f,
				function(){Ext.Msg.alert('Attenzione', '<p>Problema nel caricamento delle librerie necessarie.</p><p>La funzione pu&ograve; mostrare le coordinate nel solo sistema di riferimento <b>' + this.getProjectionCode() + '</b></p>',function(){this.contextMenu.setCrsSelected(this.getProjectionCode());f.call(this)},this);},
				this);
		}
	},
	
	releaseStreetviewEnable: function(posX,posY){
		
		var crs = "EPSG:4326";
		
		var f = function(){
			var viewPos = this.getViewerPosition(); 
			var coordinate = this.viewer.pluginGetCoordinateFromPixel({x:(posX-viewPos.x),y:(posY-viewPos.y)});
			// Messa solamente per assicurarmi che la proiezione attuale sia gi� stata caricata
			var currProj = new TolomeoExt.Projection(this.getProjectionCode());	
			
			if(!this.svWin){
			
				// da mettere afterrender altrimenti api non esiste
				this.svPanel = new TolomeoExt.ToloStreetviewViewerPanel({
					viewer: this.viewer
				});
	
				this.svWin = new Ext.Window({
					cls: 'clsStreetViewWindow',
					height: 400,
					width: 500,
					collapsible: true,
					maximizable: true,
					layout: 'fit',
					items: [this.svPanel],
					closable: true,
					closeAction: 'hide',
					cls: 'clearCSS',
					listeners: {					
						hide: {
							fn: function () {
								this.viewer.pluginStreetViewClear();
							},
						  	scope: this
						}
					}
				});
				
				this.svWin.on('afterlayout',
					function(){
						this.setStreetviewPosition(coordinate.x,coordinate.y,crs);
					},this,{single: true});			
					
			} else {
				this.setStreetviewPosition(coordinate.x,coordinate.y,crs);
			}
			
			this.svWin.show();		
			this.svWin.setPosition(this.viewer.getPosition());
		}
		
		if(crs == this.getProjectionCode()){
			f.call(this);
		}else{
			this.lazyLoadScript(
				'proj4js',
				f,
				function(){Ext.Msg.alert('Attenzione', '<p>Problema nel caricamento delle librerie necessarie.</p><p>La funzione pu&ograve; mostrare le coordinate nel solo sistema di riferimento <b>' + this.getProjectionCode() + '</b></p>');},
				this);
		}
			
	},
	
	/**
	 * Method: releaseCoordinate
	 * rilascia un popup sul viewer con le coordinate nel sistema di riferimento scelto
	 *
	 * Parameters:
	 * mousexy - {Point} posizione del mouse
     * coordsxy - {Point} posizione nel sistema di riferimento base
	 * crs - {String} Codice EPSG del sistema in cui si vogliono le coordinate (Es. EPSG:26591)
	 */
	setStreetviewPosition: function(coordX,coordY,crs){				

		var currProj = new TolomeoExt.Projection(this.getProjectionCode());	
		var currPoint = new Point(coordX,coordY);
		var currReproj = currProj;

		if(crs!= this.getProjectionCode() && TolomeoExt.lazyLoad.checkLoad('proj4js')){
			currReproj = new TolomeoExt.Projection(crs);
			currPoint = TolomeoExt.Projection.transform(currPoint.clone(),currProj,currReproj);
		}
		
		this.svPanel.setViewPosition(currPoint.x,currPoint.y);
			
	},	
	
	/**
	 * Method: releaseCoordinate
	 * rilascia un popup sul viewer con le coordinate nel sistema di riferimento scelto
	 *
	 * Parameters:
	 * mousexy - {Point} posizione del mouse
     * coordsxy - {Point} posizione nel sistema di riferimento base
	 * crs - {String} Codice EPSG del sistema in cui si vogliono le coordinate (Es. EPSG:26591)
	 */
	releaseCoordinate: function(coordX,coordY,crs){				
		
		var crsCode = crs?crs:this.getProjectionCode();
		var currCrsCode = this.getProjectionCode();
		var currProj = new TolomeoExt.Projection(currCrsCode);
		var reprojSrs = this.projectionCrs;		
		var currPoint = new Point(coordX,coordY);
		var currReproj = currProj;

		if(crsCode!= this.getProjectionCode() && TolomeoExt.lazyLoad.checkLoad('proj4js')){
			currReproj = new TolomeoExt.Projection(crsCode);
			currPoint = TolomeoExt.Projection.transform(currPoint.clone(),currProj,currReproj);
			currCrsCode = crsCode;
		}
		
		var currDescr = currReproj.getTitle();
		if(reprojSrs[currCrsCode]){ 
			if (reprojSrs[currCrsCode].precision){
				currPoint.round(reprojSrs[currCrsCode].precision);
			}
			if(reprojSrs[currCrsCode].description){
				currDescr = reprojSrs[currCrsCode].description ;
			}
		}
		var units = currReproj.getUnits()? " [" + currReproj.getUnits() + "]" : "";

		var htmlText = "<div style='font: 11px tahoma,arial,helvetica,sans-serif;'><b><u>" + currCrsCode + "</u></b><br><b>" + currDescr + units + "</b><br>" + currPoint.toString()+"</div>";
		
		this.addPopup(coordX,coordY,htmlText);
			
	},	
	
	/**
	 * Method: getViewPosition
	 * Restituisce un oggetto con le proprieta x e y che rappresentano la posizione del viewer	
	 */
	getViewerPosition: function(){
		if (this.viewer) {
			var viewerPos = this.viewer.getPosition();
			return {x:viewerPos[0],y:viewerPos[1]};
		}
		return {x:0,y:0};
	},
	
	/**
	 * Method: getProjectionCode
	 * @return {String} restituisce il codice EPSG del sistema di riferimento
	 */
	getProjectionCode: function(){
		return this.viewer.pluginGetProjectionCode();
	},
	
	/**
	 * Method: lazyLoadScript
	 * Metodo per i caricamento onDemand degli script. Durante il caricamento mette il sistema onBusy
	 *
	 * Parameters:
	 * jsKeys - {String/Array} Chiave o array di chiavi definite nel file toloLazyLoad per il caricamento in sequenza degli script correlati
     * onLoad - {Function} Funzione da chiamare quando lo script � caricato
	 * onFail - {Function} Funzione da chiamare quando non si riesce a recuperare lo script
	 * scope - {Object} Ambito della chiamata delle funzioni	 
	 */
	lazyLoadScript: function (jsKeys,onLoad,onFail,scope){
		
		var jsKeysArr = [];
		
		if(jsKeys instanceof Array){
			jsKeysArr = jsKeys;
		}else{
			jsKeysArr.push(jsKeys);	
		}
										
		if(jsKeysArr.length == 0) return;
		
		var me = this;
		
		if(jsKeysArr.length > 1) {
	        var first = jsKeysArr.shift();
	        me.lazyLoadScript(first,
	                      function() { me.lazyLoadScript(jsKeysArr, onLoad, onFail, scope); },
	                      onFail,
	                      scope);
	        return;
	    }
	    
	    var jsKey = jsKeysArr[0];
		
		if(TolomeoExt.lazyLoad.checkLoad(jsKey)){
			if(onLoad){
				onLoad.call(scope);
			}
		}else{
			this.onBusy(true);
			var me = this;
			TolomeoExt.lazyLoad.get(
				jsKey,
				function(){
					this.onBusy(true);
					if(onLoad){
						onLoad.call(scope);
					}
				},
				function(){
					this.onBusy(true);
					if(onFail){
						onFail.call(scope);
					}
				}
				,this);
		}
	},
	// AutoIdentify - FINE
	
	generateCustomInfo : function(helpInfo){				
		
		var infoItems = [];
		
		for(var i = 0; i < helpInfo.infoList.length; i++){
			
			var info = helpInfo.infoList[i];
			var infoItem;
			
			if(info.framed){			
				infoItem = {
					title: info.title,    				
    				autoScroll: false,    				
    				items: [{
						xtype : 'box',												
						autoEl : {
							tag : 'iframe',
							style : 'border-width: 0px',
							src : (info.url ? info.url : 'about:blank')
						}
					}]
					
					//oppure
					//html = '<iframe width="100%" height="100%" frameborder="0" src="' + (info.url ? info.url : 'about:blank') + '"></iframe>';
				}	
			} else {								
				infoItem = {
					title: info.title,
					loader: {
						url: (info.url ? info.url : 'about:blank'),
						autoLoad: true
					}					 	
				}
			}
			
			infoItems.push(infoItem);
		}
		
		this.customInfoWin = new Ext.Window({
			
			title: helpInfo.mainTitle,
			bodyStyle: 'padding: 0px',
			cls: 'clearCSS',
			width: 550,
			height: 450,			
			modal: true,
			closeAction: 'hide',
			constrain: true,
			layout: 'fit',
			buttons: [{
	        	text: 'Chiudi',
	       		listeners: {click: {fn: function() {
	       			this.customInfoWin.hide();
	       		},scope: this}}	       		
	        }],
	        items : {
	        	xtype : 'tabpanel',
	        	activeItem : 0,
	        	minTabWidth : 120,
    			tabWidth    : 135,
    			enableTabScroll: true,
    			border: false,
    			defaults: {
    				xtype: 'panel',
    				layout: 'fit',
    				autoScroll: true
    			},
    			items: infoItems
	        }
		});
				
	},
	
	showCustomInfo : function(helpInfo){
		if(!this.customInfoWin){
			this.generateCustomInfo(helpInfo)
		}
		this.customInfoWin.show();
	},
	
	showGuide: function(url){
		window.open(url);
	},
	
	showFaq: function(url){
		window.open(url);
	},
	
	regeneratePage: function(){
		window.location.reload(true);
	},
	
	mailToAdmin : function(to,subject){
		
		var url = 'mailto:' + to;
    	var subject = subject ? subject : "Tolomeo";
    	var body = "";        	
    	body += "User Agent : " + navigator.userAgent;
    	body += "\n\r";
    	body += "Url : " + location.href;
    	body += "\n\r";
    	body += "Versione Tolomeo : " + TolomeoExt.Vars.TOLOMEOVersion;
    	body += "\n\r";
    	body += "SIT core : " + this.paramsJS.sitCoreVersion;
    	body += "\n\r";
		body += "ExtJS : " + Ext.getVersion();
		body += "\n\r";
		body += "OpenLayers : " + OpenLayers.VERSION_NUMBER;
    	body += "\n\r";        	
    	body += "----------------------------------------";
    	body += "\n\r";        	
    	body += "Problema : ";
    	
    	url = Ext.String.urlAppend(url,"subject=" + subject);
    	url = Ext.String.urlAppend(url,"body=" + escape(body)); 
    	
    	window.open(url);
	}
});
