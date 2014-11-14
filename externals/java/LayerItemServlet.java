/*******************************************************************************
 * Tolomeo is a developing framework for visualization, editing,  
 * geoprocessing and decisional support application based on cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License 
 * as published by the Free Software Foundation; either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 * 
 * Developers Information:
 * 
 * Tolomeo is developed by Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it 
 * 
 * 
 * Versione in Italiano LGPL
 * 
 * Tolomeo è un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo è un software libero; è possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo è distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 * IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo è sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
/**************************************************************
* Copyright © 2007 Comune di Prato - All Right Reserved
* Project:      Tolomeo - WebGis con funzioni di editing
* File:         AjaxQueryServlet.java
* Function:     Servlet di default per query oggetti secondo criterio
* Author:       Alessandro Radaelli
* Version:      1.0.0
* CreationDate: 04/09/2007
* ModifyDate:   
***************************************************************/

package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.ExtStoreError;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 *      
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 * 
 */
public class LayerItemServlet extends TolomeoServlet {

	private static final long serialVersionUID = -7380651195335942052L;

	@Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);           
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

	@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    	// Get the logger
        LogInterface logger = getLogger(request);
        
        // Get parameters
        Integer codTPN = getCodTPN(request);
        String mode = request.getParameter("command");
        String idTPN = request.getParameter("IDTPN");
        String data = request.getParameter("data");
        
        // Used only to create a new feature
        String wkt = request.getParameter("geometry");
        String srid = request.getParameter("SRID");
        
        logger.debug("LayerItemServlet codTPN: " + codTPN);
        
        SITLayersManager comunePO = null;
        String resp     = null;
        
        try {
        	// Get the Oggetto Territorio
        	comunePO = getTerritorio(logger);
	        // Get the layer identified by codTPN
	        LayerTerritorio layer = comunePO.getLayerByCodTPN(codTPN);
	        
	        if (layer != null) {
	        	JSONObject responseObj = null;
	        	
	        	if(mode.equals("view")){
	        		// /////////////////////////////////////////////////////////
	        		// READ MODE: This mode get the presentation configuration
	        		// /////////////////////////////////////////////////////////
	        		HashMap<String, String> layerAttributeNames = layer.getNomiCampi();
	        		JSONArray view = this.buildOutputConfiguration(idTPN, layer, layerAttributeNames, false);
	        		responseObj = SITExtStore.extStore(view, null);
	        	}else if(mode.equals("edit")){
	        		// /////////////////////////////////////////////////
	        		// EDIT MODE: This mode get the edit configuration
	        		// /////////////////////////////////////////////////
        			responseObj = this.buildEditResponse(layer, idTPN);
	        	}else if(mode.equals("update")){
	        		// ///////////////////////////////////////////////////////
	        		// UPDATE MODE: This mode updates data sent by the client
	        		// ///////////////////////////////////////////////////////
	        		JSONArray values = JSONArray.fromObject(data);
	        		
	        		OggettoTerritorio feature = layer.cercaIDTPN(idTPN);
	        		
	        		int size = values.size();
	        		for(int i=0; i<size; i++){
	        			JSONObject attribute = (JSONObject)values.get(i);
	        			
	        			feature.setAttributeByNL((String)attribute.get("nl"), attribute.get("value"));
	        		}
	        		
	        		layer.modifyFeature(feature);
	        		
	        		responseObj = this.buildEditResponse(layer, idTPN);
	        	}else if(mode.equals("delete")){
	        		// /////////////////////////////////////////////////////////////////////////////
	        		// DELETE MODE: This mode delete a feature using the ID specified by the client
	        		// /////////////////////////////////////////////////////////////////////////////
		        	OggettoTerritorio feature = layer.cercaIDTPN(idTPN);
		        	layer.removeFeature(feature);
		        	
		        	responseObj = SITExtStore.extStoreFromString("Cancellazione della feature avvenuta con successo.");
	        	}else if(mode.equals("new")){
	        		// ////////////////////////////////////////////////////////
	        		// CREATE MODE: this mode creates a new object (feature) 
	        		// ////////////////////////////////////////////////////////
	        		JSONArray values = JSONArray.fromObject(data);
	        		
	        		OggettoTerritorio feature = layer.creaNuovoOggettoTerritorio();
	        		
	        		int size = values.size();
	        		for(int i=0; i<size; i++){
	        			JSONObject attribute = (JSONObject)values.get(i);
	        			
	        			String property = (String)attribute.get("nl");
	        			if(property.equals("NL_IDTPN")){
	        				idTPN = (String)attribute.get("value");
	        			}
	        			
	        			feature.setAttributeByNL((String)attribute.get("nl"), attribute.get("value"));
	        		}
	        		
	        		feature.setGeometryAttributeWKT(wkt);
	        		
	        		layer.appendFeature(feature);
	        		
	        		responseObj = this.buildEditResponse(layer, idTPN);
	        	}
	        	
        		responseObj.put("security", "all");
	        	resp = responseObj.toString();
	        	
	        } else {
	        	String errMsg = "Il layer con codice " + codTPN + " è nullo";
	        	resp = new ExtStoreError(errMsg,null).toJSONString();
	            logger.error(errMsg);
	        }
        } catch (SITException e) {
        	String errMsg = e.getMessage();
        	resp = new ExtStoreError(errMsg, null).toJSONString();
            logger.error(errMsg);
		} catch (SQLException e) {
        	String errMsg = e.getMessage();
        	resp = new ExtStoreError(errMsg, null).toJSONString();
            logger.error(errMsg);
		} finally {        	
            if(comunePO != null){
                try {
                    comunePO.dispose();
                } catch (SITException e) {
                    logger.error("Impossibile fare il dispose del LayersManager",e);
                }
            }
            
            request.setAttribute("geometry", resp);
            forward(request, response);
        }
    }
	
	/**
	 * Restituisce lo store finale dei dati da fornire al client.
	 * 
	 * @param view
	 * @return JSONObject
	 */
	private JSONObject buildExtStore(JSONArray view){
		JSONObject responseObj = SITExtStore.extStore(view, null);
		return responseObj;
	}
	  
    /**
     * Compone la richiesta per la modalità di 'edit'.
     * 
     * @param layer
     * @param idTPN
     * @return JSONObject
     * @throws SITException
     */
    private JSONObject buildEditResponse(LayerTerritorio layer, String idTPN) throws SITException{
		HashMap<String, String> layerAttributeNames = layer.getNomiCampiScrittura();
		JSONArray view = this.buildOutputConfiguration(idTPN, layer, layerAttributeNames, true);
		JSONObject responseObj = this.buildExtStore(view);
		
		return responseObj;
    }
       
    /**
     * Restituisce la configurazione di output per la form codeless.
     * 
     * @param idTPN
     * @param layer
     * @param layerAttributeNames
     * @param editable
     * @return JSONArray
     * @throws SITException
     */
    private JSONArray buildOutputConfiguration(String idTPN, LayerTerritorio layer, 
    		HashMap<String, String> layerAttributeNames, boolean editable) throws SITException{
    	
    	HashMap<String, String> layerAttributeNamesReadable = layer.getNomiCampiLegibili();
    	HashMap<String, Class<?>> layerAttributeTypes = layer.getAttributiTipo();
    	HashMap<String, String> layerAttributeRegEx = layer.getAttributiRegEx();
    	
    	// //////////////////////////////////////////////
    	// Feature could be null if we are trying to 
    	// create a new object (idTPN=null).
    	// //////////////////////////////////////////////
		OggettoTerritorio feature = layer.cercaIDTPN(idTPN);
		boolean newFeature = feature == null;
		
		Set<String> keys = layerAttributeNames.keySet();
		Iterator<String> iterator = keys.iterator();
		
		JSONArray view = new JSONArray();
		
		// //////////////////////////////////////////////////////
		// Not editable record only to present the layer name.
		// //////////////////////////////////////////////////////
		JSONObject levelName = new JSONObject();
		levelName.put("name", "Livello");
		levelName.put("nl", "");
		levelName.put("value", layer.getNome());
		levelName.put("type", layer.getNome().getClass());
		levelName.put("editable", false);
		levelName.put("validation", "undefined");
		
		view.add(levelName);
		
		// ///////////////////////////////
		// Fill records for attributes
		// ///////////////////////////////
		while(iterator.hasNext()){
			String key = (String)iterator.next();
			
			String nr = layerAttributeNamesReadable.get(key);
			String nl = layerAttributeNames.get(key);
			
			String validation = layerAttributeRegEx.get(key); 
			
			JSONObject attribute = new JSONObject();
			attribute.put("name", nr != null ? nr : nl);
			attribute.put("nl", key);
			attribute.put("value", !newFeature ? feature.getAttributeByNL(key) : "");
			attribute.put("type", layerAttributeTypes.get(key));
			attribute.put("validation", validation != null ? validation : "undefined");
			
			// In 'edit' or 'new' modes by default the field is editable 
			boolean edit = editable;
			if(!newFeature && key.equals("NL_IDTPN")){
				// //////////////////////////////////////////////////
				// In edit mode the IDTPN should not be editable 
				// //////////////////////////////////////////////////
				edit = false;
			}else{
				// ///////////////////////////////////////////////////////////
				// For a new feature or not the field should be editable only 
				// if specified in configuration (config.txt on Spring).
				// ///////////////////////////////////////////////////////////
				HashMap<String, String> nomiCampiRW = layer.getAttributiReadWrite();
				if(nomiCampiRW != null && nomiCampiRW.get(key) != null){
					// We have to check if we are in 'view' mode or not before setting the flag.
					edit = editable ? true : false;
				}else{
					edit = false;
				}
			}
			
			attribute.put("editable", edit);
			
			view.add(attribute);
		}
		
		return view;
    }

    @Override
    protected String getDefaultForward() {
        return "/jsp/tolomeoAjaxQuery.jsp";
    }
    
}