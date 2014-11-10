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
        
    	// Recupero il logger
        LogInterface logger = getLogger(request);
        
        // Recupero i parametri
        Integer codTPN = getCodTPN(request);
        String mode = request.getParameter("command");
        String idTPN = request.getParameter("IDTPN");
        
        logger.debug("LayerItemServlet codTPN: " + codTPN);
        
        SITLayersManager comunePO = null;
        String resp     = null;
        
        try {
        	// Recupero l'oggetto Territorio
        	comunePO = getTerritorio(logger);
	        // Recupero il layer identificato da codTPN
	        LayerTerritorio layer = comunePO.getLayerByCodTPN(codTPN);
	        
	        if (layer != null) {
	        	JSONArray view = null;
	        	
	        	if(mode.equals("view")){
	        		HashMap<String, String> layerAttributeNames = layer.getNomiCampi();
	        		view = this.buildOutputConfiguration(idTPN, layer, layerAttributeNames, false);
	        	}else if(mode.equals("edit")){
	        		HashMap<String, String> layerAttributeNames = layer.getNomiCampiScrittura();
	        		view = this.buildOutputConfiguration(idTPN, layer, layerAttributeNames, true);
	        	}
	        	
        		JSONObject responseObj = SITExtStore.extStore(view, null);//.extStoreSingleRecord(view, null);
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
    	
		OggettoTerritorio feature = layer.cercaIDTPN(idTPN);
		
    	HashMap<String, Class<?>> layerAttributeTypes = null;
 
    	layerAttributeTypes = layer.getAttributiTipo();
    	
		Set<String> keys = layerAttributeNames.keySet();
		Iterator<String> iterator = keys.iterator();
		
		JSONArray view = new JSONArray();
		
		JSONObject levelName = new JSONObject();
		levelName.put("name", "Livello");
		levelName.put("value", layer.getNome());
		levelName.put("type", layer.getNome().getClass());
		levelName.put("editable", false);
		
		view.add(levelName);
		
		while(iterator.hasNext()){
			String key = (String)iterator.next();
			
			String nr = layerAttributeNamesReadable.get(key);
			String nl = layerAttributeNames.get(key);
			
			JSONObject attribute = new JSONObject();
			attribute.put("name", nr != null ? nr : nl);
			attribute.put("value", feature.getAttributeByNL(key));
			attribute.put("type", layerAttributeTypes.get(key));
			
			boolean edit = key.equals("NL_IDTPN") ? false : editable;        			
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