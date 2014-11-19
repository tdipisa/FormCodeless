
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
	 * @cfg {String} newFieldSetTitle
	 * Testo del field set in modalità di nuovo elemento.
	 */
	newFieldSetTitle: "Nuovo Elemento",
	
	/**
	 * @cfg {String} applyModsTooltip
	 * Testo da mostrare per il tootlip del pulsante di salvataggio delle modifiche.
	 */
	applyModsTooltip: "Applica Modifiche",
	
	/**
	 * @cfg {String} resetTooltip
	 * Testo da mostrare per il tootlip del pulsante di reset delle modifiche.
	 */
	resetTooltip: "Reimposta Campi",
	
	/**
	 * @cfg {String} restoreBoxTitle
	 * Titolo da mostrare per la dialog di conferma per il reset delle modiche.
	 */
	restoreBoxTitle: "Ripristino", 
	
	/**
	 * @cfg {String} restoreBoxText
	 * Testo da mostrare per la dialog di conferma per il reset delle modiche.
	 */
	restoreBoxText: "Procedere con il ripristoni dei dati allo stato iniziale?", 

	/**
	 * @cfg {String} saveBoxTitle
	 * Titolo da mostrare per la dialog di conferma per il salvataggio delle modiche.
	 */
	saveBoxTitle: "Salvataggio", 
	
	/**
	 * @cfg {String} saveBoxText
	 * Testo da mostrare per la dialog di conferma per il salvataggio delle modiche.
	 */
	saveBoxText: "Procedere con il salvataggio?", 
	
	/**
     * @cfg {Object} autoCompleteCfg [autoCompleteCfg="{}"]
	 * Stabilisce la configurazione da usare per la funzionalità di autocompletamento.
	 *
	 * @example
	 * autoCompleteCfg: {
	 *  	url: 'http://localhost:8080/tolomeobinj/UniqueValueServlet',
	 *		pageSize: 10
	 * }
     */
    autoCompleteCfg: {},
	
	/**
	 * @property {TolomeoExt.ToloCodelessManager} codelessManager
	 * Gestore delle operazioni del componente.
	 */
	
	/**
	 * @property {Ext.grid.Panel} propertyGrid
	 * Griglia ExtJs per la presentazione e la modifica dei dati richiesti.
	 */
	
	/**
	 * @property {Ext.grid.Panel} decodeGrid
	 * Griglia ExtJs per la presentazione e la modifica dei dati relativi alle tabelle di decodifica.
	 */
	
	/**
	 * @property {String} mode
	 * Stringa che indica la modalità di funzionamento corrente della form.
	 */

	/**
     * Inizializza un nuovo TolomeoExt.ToloCodeLessPanel.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		// ///////////////////// //
		// FEATURE DI SELEZIONE  //
		// ///////////////////// //
		
		var gridStore = Ext.create('Ext.data.Store', {
		    fields: ["name", "nl", "type", "editable", "validation", "value", "format"],
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
	    
	    var me = this;
		this.propertyGrid = Ext.create('Ext.grid.Panel', {
			margin: "5 0 5 0",
			hideHeaders: true,
			store: gridStore,
		    columns: [
              {
            	  header: 'Nome',  
            	  dataIndex: 'name', 
            	  flex: 50/100
              },              {
            	  header: 'NL',  
            	  dataIndex: 'nl',
                  hidden: true
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
            	  header: 'Validation',  
            	  dataIndex: 'validation',
                  hidden: true
              }, 
              {
            	  header: 'Valore', 
            	  dataIndex: 'value', 
            	  flex: 50/100,
            	  renderer: function(value, metaData, record, rowIndex, store, view){
            		  var type = record.get("type"); 
	  	              switch (type) {
	                    case "java.util.Date":
	                    case "java.util.Calendar":
	                		var proxy = store.getProxy();
	                		var reader = proxy.getReader();
	                		var metadata = reader.metaData;
	                    	
	                		var format =  metadata.format || me.dateFormat;
	                    	var date = Ext.util.Format.date(value, format);
	                    	return date;
	                        break;
	                    default:
	                    	var v;
	                    	if(value.value || value.value == ""){
	                    		v = value.value;
	                    	}else{
	                    		v = value;
	                    	}
	                		return v;
	  	              }
            	  },
            	  getEditor: function(record) {
            		  	var editable = record.get("editable");
            		  	if(editable){
                		    var type = record.get("type");
                		    
                		    // ///////////////////////////////////////////////////////
                		    // Imposta la regola di validazione usando la Regular 
                		    // Expression se esiste.
                		    // ///////////////////////////////////////////////////////
                		    var validation = record.get("validation");
                		    var baseConfig = {};
                		    if(validation != "undefined"){
                		    	var valueTest = new RegExp(validation);
                		    	baseConfig = {
    	                            validator: function(value) {
    	                                return valueTest.test(value) ? true : "Valore campo non valido";
    	                            }
    	                		}
                		    }
                		    
    	  	                switch (type) {
    		                    case "java.util.Date":
    		                    case "java.util.Calendar":
    		                    	var format = record.get("format"); 
    		                		var config = Ext.apply({
		            		            allowBlank: false,
		            		            format: format
		            		        }, baseConfig);
    		                		
//    		            		    return Ext.create('Ext.grid.CellEditor', { 
//    		            		        field: Ext.create('Ext.form.FieldContainer', {
//        		        	                items: [
//        		        	                        Ext.create('Ext.form.field.Date', config),
//        		        	                        Ext.create('Ext.form.field.Time', config)
//    										]
//        		        	            })
//    		            		    });
    		                		
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Date', config)
    		            		    });
    		                        break;
    		                    case "java.lang.Boolean":
    		                		var config = Ext.apply({
		            		            allowBlank: false,
		            		        }, baseConfig);
    		                		
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Checkbox', config)
    		            		    });
    		                        break;
    		                    case "net.sf.json.JSONObject":
    		                    	var value = record.get("value");
    		                    	if(value.codTPN){
    		                            var uniqueValuesStore = new TolomeoExt.data.ToloUniqueValuesStore({
    		                                pageSize: me.autoCompleteCfg.pageSize || 10,
    		                    			TOLOMEOServer: me.TOLOMEOServer,
    		                    			TOLOMEOContext: me.TOLOMEOContext
    		                            });
    		                            
    		                            me.initUniqueValuesStore(uniqueValuesStore, value.codTPN, value.property);
    		                            
        		                		var config = {
    		                                queryMode: "remote",
    		                                store: uniqueValuesStore,
    		                                pageSize: me.autoCompleteCfg.pageSize || 10,
    		                                typeAhead: false,
    		                                forceSelection: false,
    		                                remoteSort: true,
    		                                triggerAction: "all",
    		                                allowBlank: false,
    		                                displayField: "value",
    		                                valueField: "value",
    		                                minChars: 1,
       		                                matchFieldWidth: true,
       		                                listConfig:{
       		                                	minWidth: 100,
       		                                	width: 200
       		                                },
		       		                        listeners: {
	       		                              beforequery: function(evt) {
	       		                                  evt.combo.store.baseParams.start = 0;
	       		                                  evt.combo.store.baseParams.query = evt.combo.getValue();
	       		                              },
	       		                              scope: me
		       		                        }
    		                            };
        		                		
        		            		    return Ext.create('Ext.grid.CellEditor', { 
        		            		        field: Ext.create('TolomeoExt.widgets.form.ToloUniqueValuesCombo', config)
        		            		    });
        		            		    
        		            		    break;
    		                    	}
    		                    case "java.lang.String":
    		                		var config = Ext.apply({
		            		            allowBlank: false,
		            		        }, baseConfig);
    		                		
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Text', config)
    		            		    });
    		                        break;
    		                    default:
    		                		var config = Ext.apply({
		            		            allowBlank: false,
		            		        }, baseConfig);
    		                    
    		            		    return Ext.create('Ext.grid.CellEditor', { 
    		            		        field: Ext.create('Ext.form.field.Number', config)
    		            		    });
    		                }
            		  	}
            	  }
              }
            ],
            plugins: [cellEditing],
			listeners: {
				scope: this,
				edit: function(grid, cell){
					this.setBtnStatus(true);
				},
				beforeEdit: function(editor, context, eOpts){
					var value = editor.context.value;
					if(value.value || value.value == ""){
						editor.context.value = value.value;
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
		
		// ///////////////////// //
		// FORM DI PRESENTAZIONE //
		// ///////////////////// //
		
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
		    buttons: [{
		    	xtype: "button", 
		    	minWidth: '20',
		    	ref: "resetButton",
		    	tooltip: this.resetTooltip,
		    	iconCls: "reset",
		    	disabled: true,
		    	hidden: true,
		    	scope: this,
		    	handler: function(button){
		    		Ext.MessageBox.confirm(
	    				this.restoreBoxTitle,
	    				this.restoreBoxText,
	    				function(btn){
		    			   if(btn === 'yes'){
		    				   this.codelessManager.restore();
		    			   }
	    				}, 
	    				this
    				);
		    	}
		    },{
		    	xtype: "button", 
		    	minWidth: '20',
		    	ref: "saveButton",
		    	tooltip: this.applyModsTooltip,
		    	iconCls: "save",
		    	disabled: true,
		    	hidden: true,
		    	scope: this,
		    	handler: function(button){
		    		
		    		// ////////////////////////////////////////////////
		    		// La Griglia ExtJS esegue già il controllo di 
		    		// validità di un campo ripristinando il valore 
		    		// precedente nel caso in cui tale valore inserito 
		    		// sia invalido.
		    		// ////////////////////////////////////////////////
		    		
		    		Ext.MessageBox.confirm(
	    				this.saveBoxTitle,
	    				this.saveBoxText, 
	    				function(btn){
		    			   if(btn === 'yes'){
		    				   if(this.mode == "new"){
		    					   this.codelessManager.create();
		    				   }else{
		    					   this.codelessManager.update();
		    				   }
		    			   }
	    				}, 
	    				this
    				);
		    	}
		    }]
		});
		
		this.callParent();
		this.buildManager(gridStore);
		
		this.add([this.formPanel]);
	},
	
	/**
     * Crea il componente Ext destinato a contenere il valore delle proprietà.
     * @param {TolomeoExt.data.ToloUniqueValuesStore} store Store della combo box di auto completamento.
     * @param {String} url Url del servizio remoto di auto completamento.
     * @param {String} layerName codTPN da usare com eparametro della richiesta.
     * @param {String} fieldName Nome della proprietà di cui ritornare i suggerimenti.
     * 
     */
    initUniqueValuesStore: function(store, layerName, fieldName) {
        var params = {
            inputs: {
            	featureTypeName: layerName,
                fieldName: fieldName
            },
            start: 0,
            limit: this.autoCompleteCfg.pageSize || 10
        };
        
        store.setParams(params);
    },
	
	/**
     * Crea il Gestore delle richieste se assente e registra gli eventi necessari.
     * @param {Ext.Data.Store} store Store che il Manager deve gestire.
     */
	buildManager: function(store){
		this.codelessManager = Ext.create('TolomeoExt.ToloCodelessManager', {
			TOLOMEOServer : this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext,
			store: store
		});
		
		this.codelessManager.on({
			changemode: function(mode, store){
				this.setFormMode(mode, store);
			},
			objectselected: function(){
				this.hideForm();
			},
			restore: function(){
				this.setBtnStatus(false);
			},
			updatedata: function(){
				this.setBtnStatus(false);
			},
			createdata: function(){
				this.setBtnStatus(false);
			},
			deletedata: function(){
				this.setBtnStatus(false);
				this.setBtnVisibility(false);
				this.hideForm();
			},
			scope: this
		});
	},
	
	/**
     * Imposta sul Manager l'oggetto di controllo della mappa per intercettare le 
     * operazioni utente (eventi tolomeo) e procedere con la gestione della form.
     * @param {TolomeoExt.ToloMapAPIExt} mapApiExt Oggetto di controllo della mappa.
     */
	setMapApiExt: function(mapApiExt){
		this.codelessManager.setMapApiExt(mapApiExt);
	},
	
	/**
     * Imposta la modalità con cui configurare la form.
     * @param {String} mode Modalità di configurazione (view, edit, new).
     * @param {Ext.Data.Store} store Store con gui configurare la griglia dei dati
     */
	setFormMode: function(mode, store){
		this.mode = mode;
		
		if(mode == "view"){
			this.fieldSet.setTitle(this.viewFieldSetTitle);	
			this.setBtnVisibility(false);
		}else if(mode == "edit"){
			this.fieldSet.setTitle(this.editFieldSetTitle);
			this.setBtnVisibility(true);
		}if(mode == "new"){
			this.fieldSet.setTitle(this.newFieldSetTitle);
			this.setBtnVisibility(true);
		}
		
		this.propertyGrid.reconfigure(store);
		
		this.showForm();
	},
	
	/**
     * Visualizza la form dei dati.
     * @param {boolean} withDecode Stabilisce se visualizzare anche la form di decodifica.
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
	},
	
	/**
     * Imposta lo stato dei pulsanti presenti nella toolbar del pannello di modifica.
     */
	setBtnStatus: function(enabled){
		if(enabled === true){
			this.formPanel.query("button[ref=resetButton]")[0].enable();
			this.formPanel.query("button[ref=saveButton]")[0].enable();
		}else{
			this.formPanel.query("button[ref=resetButton]")[0].disable();
			this.formPanel.query("button[ref=saveButton]")[0].disable();
		}
	},
	
	/**
     * Imposta la visibilità dei pulsanti presenti nella toolbar del pannello di modifica.
     */
	setBtnVisibility: function(visible){
		if(visible === true){
			this.formPanel.query("button[ref=saveButton]")[0].show();
			this.formPanel.query("button[ref=resetButton]")[0].show();
		}else{
			this.formPanel.query("button[ref=saveButton]")[0].hide();
			this.formPanel.query("button[ref=resetButton]")[0].hide();
		}
	}
    
});
