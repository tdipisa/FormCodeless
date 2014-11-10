
/**
 * Strumento di visualizzazione ed editing dei dati configurabile, 
 * senza la necessità di scrivere codice (“codeless”) per Tolomeo. 
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloCodeLessPanel', {

	extend: 'Ext.Panel',

	/**
	 * @cfg {Object} paramsJS
	 * Configurazioni specifiche del file di preset.
	 */
	paramsJS: null,

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
	 * @cfg {String} viewFieldSetTitle
	 * Testo del field set in modalità di visualizzazione.
	 */
	viewFieldSetTitle: "Visualizzazione Dati",
	
	/**
	 * @cfg {String} editFieldSetTitle
	 * Testo del field set in modalità di modifica.
	 */
	editFieldSetTitle: "Modifica Dati",
	
	/**
	 * @property {TolomeoExt.ToloMapAPIExt} mapApiExt
	 * Oggetto di controllo della mappa.
	 */
	
	/**
	 * @property {Boolean} editing
	 * Stabilisce se le form deve consentire la modifica.
	 */
	
	/**
	 * @property {String} currentGeoOp
	 * Rappresenta l'operazione corrente attiva sulla form.
	 */
	
	/**
     * Inizializza un nuovo TolomeoExt.ToloCodeLessPanel.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		this.registerManagerListeners();
		
		var gridStore = Ext.create('Ext.data.Store', {
		    fields: ["name", "value"],
		    proxy: {
		        type: 'memory',
		        reader: {
		            type: 'json',
		            root: 'rows'
		        }
		    }
		});
		
	    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	    	clicksToEdit : 1,
	        autoCancel: false
	    });
	    
		this.propertyGrid = Ext.create('Ext.grid.Panel', {
			margin: "5 0 5 0",
			hideHeaders: true,
			store: gridStore,
		    columns: [
              {
            	  header: 'Nome',  
            	  dataIndex: 'name', 
            	  flex: 50/100
              },
              {
            	  header: 'Tipo',  
            	  dataIndex: 'type',
                  hidden: true
              },
              {
            	  header: 'Editabile',  
            	  dataIndex: 'editable',
                  hidden: true
              },              
              {
            	  header: 'Valore', 
            	  dataIndex: 'value', 
            	  flex: 50/100,
            	  getEditor: function(record) {
            		  	var editable = record.get("editable");
            		  	if(editable){
                		    var type = record.get("type");
                		    
    	  	                switch (type) {
    		                    case "java.util.Date":
    		                    case "java.util.Calendar":
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Date', {
    		            		            allowBlank: false
    		            		        })
    		            		    });
    		                        break;
    		                    case "java.lang.Boolean":
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Checkbox', {
    		            		            allowBlank: false
    		            		        })
    		            		    });
    		                        break;
    		                    case "java.lang.String":
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Text', {
    		            		            allowBlank: false
    		            		        })
    		            		    });
    		                        break;
    		                    default:
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Number', {
    		            		            allowBlank: false
    		            		        })
    		            		    });
    		                }
            		  	}
            	  }
              }
            ],
            plugins: [cellEditing],
			listeners: {
				scope: this,
				beforeedit: function(grid, cell){
					if(!this.editing){
						return false;
					}
				}
			}
		});
		
		this.fieldSet = Ext.create('Ext.form.FieldSet', {
			title: "",
			border: 0,
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			hidden: true,
			items:[this.propertyGrid]
		});
		
		this.formPanel = Ext.create('Ext.form.Panel', {
		    border: 0,	
		    cls: "tolomeo-formcodelessbbar",
		    layout: 'anchor',
		    hidden: true,
		    defaults: {
		        anchor: '100%'
		    },
		    items: [
	            this.fieldSet
		    ],
		    buttons: [/*{
		    	xtype: "button", 
		    	minWidth: '20',
		    	ref: "viewButton",
		    	tooltip: "Torna alla modalità di visualizzazione",
		    	iconCls: "view",
		    	scope: this,
		    	hidden: true,
		    	handler: function(button){
		    		var store = this.propertyGrid.getStore();
		    		this.setFormMode("view", store);
		    		
		    		//
		    		// Change buttons mode 
		    		// 
		    		this.formPanel.query("button[ref=viewButton]")[0].hide();
		    		this.formPanel.query("button[ref=editButton]")[0].show();
		    	}
		    },{
		    	xtype: "button", 
		    	minWidth: '20',
		    	ref: "editButton",
		    	tooltip: "Edita Campi",
		    	iconCls: "edit",
		    	scope: this,
		    	handler: function(button){
		    		var store = this.propertyGrid.getStore();
		    		this.setFormMode("edit", store);
		    		
		    		//
		    		// Change buttons mode 
		    		// 
		    		this.formPanel.query("button[ref=viewButton]")[0].show();
		    		this.formPanel.query("button[ref=editButton]")[0].hide();
		    	}
		    },*/{
		    	xtype: "button", 
		    	minWidth: '20',
		    	ref: "saveButton",
		    	tooltip: "Applica Modifiche",
		    	iconCls: "save",
		    	hidden: true,
		    	scope: this,
		    	handler: function(button){
		    		var store = this.propertyGrid.getStore();
		    		
		    	}
		    }]
		});
		
		this.callParent();
		
		this.add([this.formPanel]);
	},
	
	/**
     * Crea il Gestore delle richieste se assente e registra gli eventi necessari.
     * @param {TolomeoExt.ToloCodelessRequestManager} requestManager Gestore delle richieste per la form codeless.
     */
	registerManagerListeners: function(requestManager){
		if(!requestManager){
			this.requestManager = Ext.create('TolomeoExt.ToloCodelessRequestManager', {
				TOLOMEOServer : this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext
			});
		}
		
		this.requestManager.on({
			loaddata: function(store){
				this.setFormMode("edit", store);
				// ////////////////////////////////////////////////////////
				// TODO: Fix this, the event (actionsEnd) is fired two 
				// times (see also this.setMapApiExt.on('actionsEnd'))
				// ////////////////////////////////////////////////////////
				this.currentGeoOp = undefined;
			},
			scope: this
		});
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
						this.setFormMode("view", store);
						break;
					case 1: // Delete
						break;
					case 3: // Edit
						//alert("Salvataggio avvenuto con successo");
						break;
					case 4: // New
						break;
				}
			},
			onObjectSelect: function(){
				this.hideForm();
			},
			actionsEnd: function(values){
				var geoOp = values.geoOp;
				
				// TODO: fix this, the event (actionsEnd) is fired two times.
				if(geoOp != this.mapApiExt.operationIdentify){
					
					if(this.currentGeoOp != geoOp){
						this.currentGeoOp = geoOp;
						
						switch(this.currentGeoOp){
							case this.mapApiExt.operationUpdateAlfa: // Update Alpha -> 'A'
								var fparams = {
									codTPN: values.codTPN,
									command: "edit",
									IDTPN: values.IDTPN
								}; 
								
								this.requestManager.loadEditMode(fparams);
								break;
							case this.mapApiExt.digitizeOperationInsert: // Insert -> 'N'
								break;
							case this.mapApiExt.operationFeatureDelete: // Cancell -> 'C'
								break;
						}
					}
				}
			},
			scope: this
		});
	},
	
	/**
     * Imposta la modalità con cui configurare la form.
     * @param {String} mode Modalità di configurazione (view, edit).
     * @param {Ext.Data.Store} store Store con gui configurare la griglia dei dati
     */
	setFormMode: function(mode, store){
		if(mode == "view"){
			this.currentGeoOp = this.mapApiExt.operationIdentify;
			this.editing = false;
			this.fieldSet.setTitle(this.viewFieldSetTitle);	
			this.formPanel.query("button[ref=saveButton]")[0].hide();
		}else if(mode == "edit"){
			this.editing = true;
			this.fieldSet.setTitle(this.editFieldSetTitle);
			this.formPanel.query("button[ref=saveButton]")[0].show();
		}
		
		this.showForm();
		this.propertyGrid.reconfigure(store);
	},
	
	/**
     * Visualizza la form dei dati.
     */
	showForm: function(){
		this.fieldSet.show();
		this.formPanel.show();
	},
	
	/**
     * Nasconde la form dei dati.
     */
	hideForm: function(){
		this.fieldSet.hide();
		this.formPanel.hide();
	}
    
});
