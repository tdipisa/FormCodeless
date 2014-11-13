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
package it.prato.comune.tolomeo.web.parametri;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;


/**
 *
 * Se ajaxCall = true la chiamata relativa all'evento viene effettuata tramite ajax
 * La url di default effettua l'aggiornamento delle geometrie (add, sub e addsub), la cancellazione e l'inserimento (senza immissione campi) etc.
 * </br>
 * @author Alessandro Radaelli
 */
public class ParametriEventoLayerBase {
    
	private boolean    ajaxCall = true;
	private boolean    codeless = false;
	private boolean    crossDomainAjax = true;
    private String     defaulturl      = "/tolomeobinj/GeometryUpdateServlet";
    private String     url = defaulturl;
	private String     target   = "_blank";
	private String     forward  = null;
	private String     command  = null;
	private Boolean    redirect = false;
	private String     redirectUrl = null;
	private Boolean	   noTolomeoDefaultParams=false;
	
    public String getRedirectUrl() {
        return redirectUrl;
    }
    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
    public String getForward() {
        return forward;
    }
    public void setForward(String forward) {
        this.forward = forward;
    }
    public String getCommand() {
        return command;
    }
    public void setCommand(String command) {
        this.command = command;
    }
    public ParametriEventoLayerBase() {

    }
    public String getTarget() {
        return target;
    }
    public void setTarget(String target) {
        this.target = target;
    }

    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public boolean isAjaxCall() {
        return ajaxCall;
    }
    public void setAjaxCall(boolean ajaxCall) {
        this.ajaxCall = ajaxCall;
    }
    public Boolean getRedirect() {
        return redirect;
    }
    public void setRedirect(Boolean redirect) {
        this.redirect = redirect;
    }
    public boolean isCrossDomainAjax() {
        return crossDomainAjax;
    }
    public void setCrossDomainAjax(boolean crossDomainAjax) {
        this.crossDomainAjax = crossDomainAjax;
    }
    
    public void changeHostIfDefaultUrl(String protocol, String host, int port) throws URISyntaxException, MalformedURLException {
        if (getUrl().equals(this.defaulturl)) {
            URI u = new URI(getUrl());
            URI uriMappa = new URI(protocol,null,host,port,u.getPath(),u.getQuery(),null);
            setUrl(uriMappa.toString());
        }
        
        
    }
	/**
	 * @return the noTolomeoDefaultParams
	 */
	public Boolean getNoTolomeoDefaultParams() {
		return noTolomeoDefaultParams;
	}
	/**
	 * @param noTolomeoDefaultParams the noTolomeoDefaultParams to set
	 */
	public void setNoTolomeoDefaultParams(Boolean noTolomeoDefaultParams) {
		this.noTolomeoDefaultParams = noTolomeoDefaultParams;
	}
	/**
	 * @return the codeless
	 */
	public boolean isCodeless() {
		return codeless;
	}
	/**
	 * @param codeless the codeless to set
	 */
	public void setCodeless(boolean codeless) {
		this.codeless = codeless;
	}
	
	
    
}
