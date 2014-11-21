
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
	 * @property {String} deleteDialogTitle
	 * Titolo da mostrare per la dialog di cancellazione dati.
	 */
    deleteDialogTitle: "Cancellazione",
    
	/**
	 * @property {String} deleteDialogText
	 * Testo da mostrare all'interno della dialog di cancellazione dati.
	 */
    deleteDialogText: "Procedere con la cancellazione dei dati?",

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
			 * Lanciato prima di effettuare la richiesta di creazione di una feature.
			 */
			"beforecreatedata",
	        /**
			 * @event
			 * Lanciato al termine della richiesta di creazione di una nuova feature se questa è andata a buon fine.
			 */
			"createdata",
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
			codelessaction: function(eventoLayer, tipoEvento, object){
				this.selection = object;
				
				switch(tipoEvento){
					case 0: // Identify
						// /////////////////////////////////////////////
						// Caricamento di tutte le informazioni al 
						// fine di preparare la griglia per la modalità
						// di visualizzazione
						// /////////////////////////////////////////////
						var fparams = {
							codTPN: this.selection.codTPN,
							command: "view",
							IDTPN: this.selection.key
						}; 
						
						this.loadViewMode(fparams);
						break;
					case 1: // Delete
			    		Ext.MessageBox.confirm(
		    				this.deleteDialogTitle, 
		    				this.deleteDialogText, 
		    				function(btn){
			    			   if(btn === 'yes'){
									// ///////////////////////////////////////
									// Cancella l'oggetto selezionato
									// ///////////////////////////////////////
									var fparams = {
										codTPN: this.selection.codTPN,
										command: "delete",
										IDTPN: this.selection.key
									}; 
									
									this.cancel(fparams);
			    			   }
		    				}, 
		    				this
						);
						break;
					case 3: // Edit
						// /////////////////////////////////////////////
						// Caricamento di tutte le informazioni al 
						// fine di preparare la griglia per la modalità 
						// di modifica
						// /////////////////////////////////////////////
						var fparams = {
							codTPN: this.selection.codTPN,
							command: "edit",
							IDTPN: this.selection.key
						}; 
						
						this.loadEditMode(fparams);
						break;
					case 4: // New
						// ////////////////////////////////////////////
						// Caricamento di tutte le informazioni al 
						// fine di preparare la griglia per l'aggiunta 
						// di un nuovo elemento 
						// ////////////////////////////////////////////
						if(!this.selection){
							this.selection = this.mapApiExt.geoCoordField.getValue();
							this.selection = Ext.decode(this.selection);
						}
						
						var fparams = {
							codTPN: this.selection.codTPN,
							command: "edit"
						}; 
						
						this.loadEditMode(fparams, true);
						break;
				}
			},	
			onObjectSelect: function(){
				this.fireEvent("objectselected");
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
     * Metodo di caricamento dello store delle features per la modalità 'view'.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    loadViewMode: function(fparams){       	
    	this.fireEvent("beforeloaddata");
    	
		this.request(
			fparams,
			"GET",
    		function(results, store){
				this.setMode("view", store);
    			this.fireEvent("loaddata", store);
    		},
    		this.doAjaxFailure,
    		this
		);
    },
    
    /**
     * Metodo di caricamento dello store delle features per la modalità 'edit'.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    loadEditMode: function(fparams, isNew){       	
    	this.fireEvent("beforeloaddata");
    	
		this.request(
			fparams,
			"GET",
    		function(results, store){
				var mode = "edit";
				// //////////////////////////////////////////////////////////////
				// Controlla se stiamo cercando di creare un nuovo elemento o no 
				// //////////////////////////////////////////////////////////////
				if(isNew){
					mode = "new";
				}
				
				this.setMode(mode, store);
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
					IDTPN: this.selection.key
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
					// Ridisegna il layer per aggiornare lo stato di 
					// eventiali etichette che sono state modificate 
					// durante la procedura di aggiornamento.
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
    
    /**
     * Metodo di cancellazione dei dati.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    cancel: function(fparams){
    	this.fireEvent("beforedeletedata");
    	
		this.request(
			fparams,
			"POST",
    		function(results){
				if(results){
					// /////////////////////////////////////////////////
					// Ridisegna il layer per aggiornare lo stato di 
					// eventiali etichette che sono state modificate 
					// durante la procedura di aggiornamento.
					// /////////////////////////////////////////////////
					this.mapApiExt.viewer.pluginRefreshMap();
					
					this.fireEvent("deletedata", results);
					
					// ////////////////////////////////////
					// Informa l'utente che l'operazione è 
					// stata completata con successo.
					// ////////////////////////////////////
		            Ext.Msg.show({
		                title: this.deleteDialogTitle,
		                msg: results[0].data.Descrizione,
		                buttons: Ext.Msg.OK,
		                icon: Ext.MessageBox.INFO
		            }); 
				}			
    		},
    		this.doAjaxFailure,
    		this
		);
    },
    
    /**
     * Metodo per la raccolta dati al fine di creare un nuovo elemento.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    create: function(fparams){
    	this.fireEvent("beforecreatedata");
    	var updatedRecords = this.store.getUpdatedRecords();
    	
    	if(updatedRecords.length > 0){
    		var params = Ext.applyIf(
				{
					codTPN: this.selection.codTPN,
					command: "new",
					SRID: this.selection.SRID,
					geometry: this.selection.geometry
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
					// Ridisegna il layer per aggiornare lo stato di 
					// eventiali etichette che sono state modificate 
					// durante la procedura di aggiornamento.
					// /////////////////////////////////////////////////
					this.mapApiExt.viewer.pluginRefreshMap();
					
					this.setMode("edit", store);
	    			this.fireEvent("createdata", store);
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
    
    /**
     * Metodo di gestione della richiesta Ajax.
     */    
    request: function(params, method, success, failure, scope){
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/LayerItemServlet',
    		method: method,
    		params: params,
    		success: success,
    		failure: failure ? failure : this.doAjaxFailure,
    		scope: scope
    	};
    	
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
    },
    
    /**
     * Restituisce i metadati della richiesta.
     */  
    getRequestMetadata: function(store){
    	var gridStore = store || this.store;
		var proxy = gridStore.getProxy();
		var reader = proxy.getReader();
		var metadata = reader.metaData;
		
		return metadata;
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