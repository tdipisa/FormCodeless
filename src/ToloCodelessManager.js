
/**
 * Plugin per la gestione di richieste e operazioni 
 * che coinvolgono la form codeless.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloCodelessManager', {
	
	extend: 'Ext.util.Observable',
	
	id: "cl_manager",
	
	/**
	 * @cfg {String} TOLOMEOServer
	 * URL di base del contesto di Tolomeo.
	 */
	TOLOMEOServer: null,
	
	/**
	 * @cfg {String} TOLOMEOContext
	 * Contesto di Tolomeo.
	 */
	TOLOMEOContext: null,
	
	/**
	 * @property {TolomeoExt.ToloMapAPIExt} mapApiExt
	 * Oggetto di controllo della mappa.
	 */
	
	/**
	 * @property {String} currentGeoOp
	 * Rappresenta l'operazione corrente attiva sulla form.
	 */
	
	/**
	 * @cfg {Ext.data.Store} store
	 * Store dei dati su cui agisce il manager.
	 */
	
	/**
	 * @property {String} updateDialogTitle
	 * Titolo da mostrare per la dialog di aggiornemnto dati.
	 */
    updateDialogTitle: "Aggiornamento",
    
	/**
	 * @property {String} updateDialogText
	 * Testo da mostrare all'interno della dialog di aggiornemnto dati.
	 */
    updateDialogText: "Non sono presenti dati da aggiornare",

	/**
     * Crea un nuovo TolomeoExt.ToloCodelessManager.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
	        /**
			 * @event
			 * Lanciato alla fallimento della richiesta.
			 */
			"loaddatafailure",
	        /**
			 * @event
			 * Lanciato prima di effettuare la richiesta di aggiornamento dati.
			 */
			"beforeupdatedata",
	        /**
			 * @event
			 * Lanciato prima di effettuare la richiesta di caricamento dati.
			 */
			"beforeloaddata",
	        /**
			 * @event
			 * Lanciato al termine della richiesta di caricamento se questa è andata a buon fine.
			 */
			"loaddata",
	        /**
			 * @event
			 * Lanciato al termine della richiesta di aggiornamento se questa è andata a buon fine.
			 */
			"updatedata",
	        /**
			 * @event
			 * Lanciato prima di effettuare la richiesta di cancellazione dei dati.
			 */
			"beforedeletedata",
	        /**
			 * @event
			 * Lanciato al termine della richiesta di cancellazione se questa è andata a buon fine.
			 */
			"deletedata",
	        /**
			 * @event
			 * Lanciato a seguito della selezione di una feature in mappa.
			 */
			"objectselected",
	        /**
			 * @event
			 * Lanciato a seguito del cambio di modalità di funzionamento (edit, view o new)
			 */
			"changemode",
	        /**
			 * @event
			 * Lanciato a seguito del ripristino dello store ai valori iniziali
			 */
			"restore"
		);	
	},
	
	/**
     * Imposta l'oggetto di controllo della mappa per intercettare le 
     * operazioni utente (eventi tolomeo) e procedere con la gestione della form.
     * @param {TolomeoExt.ToloMapAPIExt} mapApiExt oggetto di controllo della mappa.
     */
	setMapApiExt: function(mapApiExt){
		this.mapApiExt = mapApiExt;
		this.mapApiExt.on({
			onEventActionAjaxSuccess: function(eventoLayer, tipoEvento, idBtn, nStep, records, store, oggetto){
				switch(tipoEvento){
					case 0: // Identify
						this.setMode("view", store);
						break;
					case 1: // Delete
						break;
					case 3: // Edit
						break;
					case 4: // New
						break;
				}
			},
			onObjectSelect: function(){
				this.fireEvent("objectselected");
			},
			actionsEnd: function(values){
				this.selection = values;
				
				// TODO: fix this, the event (actionsEnd) is fired two times.
				if(this.selection.geoOp != this.mapApiExt.operationIdentify){
					
					if(this.currentGeoOp != this.selection.geoOp){
						this.currentGeoOp = this.selection.geoOp;
						
						switch(this.currentGeoOp){
							case this.mapApiExt.operationUpdateAlfa: // Update Alpha -> 'A'
								// ///////////////////////////////////////
								// Load all the information in order to 
								// prepare the edit grid
								// ///////////////////////////////////////
								var fparams = {
									codTPN: values.codTPN,
									command: "edit",
									IDTPN: values.IDTPN
								}; 
								
								this.loadEditMode(fparams);
								break;
							case this.mapApiExt.digitizeOperationInsert: // Insert -> 'N'
								break;
							case this.mapApiExt.operationFeatureDelete: // Cancell -> 'C'
//					    		Ext.MessageBox.confirm(
//				    				'Cancellazione', 
//				    				'Procedere con la cancellazione dei dati?', 
//				    				function(btn){
//					    			   if(btn === 'yes'){
//											// ///////////////////////////////////////
//											// Delete the selected object 
//											// ///////////////////////////////////////
//											var fparams = {
//												codTPN: values.codTPN,
//												command: "delete",
//												IDTPN: values.IDTPN
//											}; 
//											
//											this._delete(fparams);
//					    			   }
//				    				}, 
//				    				this
//			    				);
								break;
						}
					}
				}
			},
			scope: this
		});
	},
	
	/**
     * Imposta la modalità di funzionamento del manager.
     * @param {String} mode Modalità di configurazione (view, edit, new).
     * @param {Ext.Data.Store} store Store da usare per componenti di tipo UI
     */
	setMode: function(mode, store){
		if(mode == "view"){
			this.currentGeoOp = this.mapApiExt.operationIdentify;
		}else if(mode == "edit"){
//			this.currentGeoOp = this.mapApiExt.operationUpdateAlfa;
		}else if(mode == "new"){
			
		}
		
		this.store = store;
		this.fireEvent("changemode", mode, store);
	},
	
	/**
     * Handler invocato in caso di fallimento della richiesta Ajax.
     * @param {Ext.Data.Store} store Oggetto rappresentante lo store dei dati. 
     *
     */
	doAjaxFailure: function (store) {
		this.fireEvent("loaddatafailure", store);
    },
    
    /**
     * Metodo di caricamento dello store delle features.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    loadEditMode: function(fparams){       	
    	this.fireEvent("beforeloaddata");
    	
		this.request(
			fparams,
			"GET",
    		function(results, store){
				// ////////////////////////////////////////////////////////
				// TODO: Fix this, the event (actionsEnd) is fired two 
				// times (see also this.setMapApiExt.on('actionsEnd'))
				// ////////////////////////////////////////////////////////
				this.currentGeoOp = undefined;
				
				this.setMode("edit", store);
    			this.fireEvent("loaddata", store);
    		},
    		this.doAjaxFailure,
    		this
		);
    },
    
    /**
     * Metodo di aggiornamento dei dati.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    update: function(fparams){
    	this.fireEvent("beforeupdatedata");
    	
    	var updatedRecords = this.store.getUpdatedRecords();
    	
    	if(updatedRecords.length > 0){
    		var params = Ext.applyIf(
				{
					codTPN: this.selection.codTPN,
					command: "update",
					IDTPN: this.selection.IDTPN
				}, 
				fparams
			); 
    		
    		var data = "[";
    		for(var i=0; i<updatedRecords.length; i++){
    			var record = updatedRecords[i];
    			var values = record.data;
    			data += Ext.encode(values);
    			
    			if(i+1 != updatedRecords.length){
    				data += ",";
    			}
    		}
    		data += "]";
    		
    		params.data = data;
    		
    		this.request(
				params,
				"POST",
				function(results, store){
					// /////////////////////////////////////////////////
					// Redraw the layer in order to refresh involved 
					// labels during the update procedures.
					// /////////////////////////////////////////////////
					this.mapApiExt.viewer.pluginRefreshMap();
					
					this.setMode("edit", store);
	    			this.fireEvent("updatedata", store);
	    		},
	    		this.doAjaxFailure,
	    		this
    		);
    	}else{
            Ext.Msg.show({
                title: this.updateDialogTitle,
                msg: this.updateDialogText,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO
            }); 
    	}
    },
    
    _delete: function(fparams){
    	this.fireEvent("beforedeletedata");
    	
		this.request(
			fparams,
			"DELETE",
    		function(results){
				if(results){
					this.fireEvent("deletedata", results);
				}			
    		},
    		this.doAjaxFailure,
    		this
		);
    },
    
    /**
     * Metodo di gestione della richiesta Ajax.
     */    
    request: function(params, method, success, failure, scope){
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/LayerItemServlet',
    		method: method,
    		params: params,
    		waitMsg: 'Ricerca in corso...',
    		success: success,
    		failure: failure ? failure : this.doAjaxFailure,
    		scope: scope
    	};
    	
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
    },
    
    /**
     * Ripristina i dati nello store eliminando le modifiche.
     *
     */
    restore: function(){
    	this.store.rejectChanges();
    	this.fireEvent("restore");
    }
	
});