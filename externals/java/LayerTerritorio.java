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
/*
 * Copyright © Comune di Prato - Sistema Informativo
 * Project:    Package SIT per elaborazione/interrogazione/gestione dati cartografici 
 * File:       LayerTerritorio.java
 * Author:     Alessandro Radaelli
 * Version:    1.0.0
 * CreationDate:   Giugno 2005
 * ModifyDate:     
 *
 * Function:   Layer astratto per la gestione di layer poligonali. 
 * Contiene tutte le funzioni necessarie per la creazione, modifica, cancellazione, 
 * interrogazione ed elaborazione. 
 *             
 */

package it.prato.comune.sit;

import it.prato.comune.errors.SITBaseError;
import it.prato.comune.sit.SortItem.Dir;
import it.prato.comune.sit.dao.LayerLastUpdateDAO;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.core.beans.IOBasicException;
import it.prato.comune.utilita.core.dao.GiornaleDAO;
import it.prato.comune.utilita.core.dao.NumeratoreDAO;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.core.type.EventType;
import it.prato.comune.utilita.core.type.IdType;
import it.prato.comune.utilita.core.type.ProgvalType;
import it.prato.comune.utilita.core.type.TsType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.NoSuchElementException;
import java.util.Properties;
import java.util.Set;
import java.util.regex.Pattern;

import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.lang.StringUtils;
import org.eclipse.xsd.XSDElementDeclaration;
import org.eclipse.xsd.impl.XSDElementDeclarationImpl;
import org.geotools.data.DataStore;
import org.geotools.data.DataUtilities;
import org.geotools.data.FeatureReader;
import org.geotools.data.FeatureSource;
import org.geotools.data.FeatureStore;
import org.geotools.data.FeatureWriter;
import org.geotools.data.FileDataStoreFactorySpi;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.Query;
import org.geotools.data.jdbc.FilterToSQLException;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.spatialite.SpatiaLiteDataStoreFactory;
import org.geotools.factory.GeoTools;
import org.geotools.factory.Hints;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.feature.Schema;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.feature.type.DateUtil;
import org.geotools.filter.text.cql2.CQL;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.jdbc.JDBCDataStore;
import org.geotools.jdbc.JDBCDataStoreFactory;
import org.geotools.jdbc.JDBCFeatureStore;
import org.geotools.jdbc.PreparedFilterToSQL;
import org.geotools.jdbc.PreparedStatementSQLDialect;
import org.geotools.jdbc.PrimaryKey;
import org.geotools.jdbc.PrimaryKeyColumn;
import org.geotools.referencing.CRS;
import org.geotools.xml.Configuration;
import org.geotools.xml.Parser;
import org.opengis.feature.Feature;
import org.opengis.feature.IllegalAttributeException;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeDescriptor;
import org.opengis.feature.type.AttributeType;
import org.opengis.feature.type.PropertyDescriptor;
import org.opengis.filter.Filter;
import org.opengis.filter.Id;
import org.opengis.filter.sort.SortBy;
import org.opengis.filter.sort.SortOrder;
import org.opengis.filter.spatial.Beyond;
import org.opengis.filter.spatial.BinarySpatialOperator;
import org.opengis.filter.spatial.Contains;
import org.opengis.filter.spatial.Intersects;
import org.opengis.filter.spatial.Touches;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.xml.sax.SAXException;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LinearRing;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.geom.MultiPoint;
import com.vividsolutions.jts.geom.MultiPolygon;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;

/**
 * LayerTerritorio è una classe astratta per la gestione di layer di oggetti territoriali. <br>
 * Le implementazioni di layer reali devono estendere questa classe, implementando i metodi 
 * astratti secondo quanto indicato nella documentazione dei metodi stessi. <br> 
 * Le classi che estendono LayerTerritorio, per poter essere utilizzate devono:<br>
 * <ul>
 * <li>essere inizializzate all'interno della classe {@link Territorio} secondo documentazione</li>
 * <li>essere configurate all'interno del file di configurazione.</li>
 * </ul>
 * 
 * @author Alessandro Radaelli
 *
 */
public abstract class LayerTerritorio implements Layers, IGetFeatureInfoLayer{

//  public static final short OpAddFiltroAND = 1;
//  public static final short OpAddFiltroOR  = 2;

    protected LogInterface logger;

    protected ConfigBean  configBean   = null;
//  protected Filter      filtroTotale = null;
    protected Filtro filtroTotale;
    private String Nome;
    //private   int IDLayer;
    private  int codTPN;
    protected TsType dtInizioFiltro;
    protected TsType dtFineFiltro;
    private HashMap<String, String> NomiCampi = new HashMap<String, String>();
    private HashMap<String, String> NomiCampiScrittura = new HashMap<String, String>();
    private HashMap<String, String> nomiCampiLegibili = new HashMap<String, String>();
    private HashMap<String, String> attributiRegEx = new HashMap<String, String>();
    private HashMap<String, String> attributiReadWrite = new HashMap<String, String>();
    private HashMap<String, String> defaultAttributeValues= new HashMap<String, String>();
    
    private HashMap<String, String> attributiFk = new HashMap<String, String>();
    
    private String dateFormat = null;
    
    private HashMap<Integer, MetadatoRicerche> ricerche = new HashMap<Integer, MetadatoRicerche>();

    private String espressioneDescrizione = null;
    private String espressioneNomeOggetto = null;
    private String espressioneIDTPN = null;
	private List<String> espressioneDescrizioneSuggest = null;
    private DataStore datastore = null;
    @SuppressWarnings("unused")
    private String configFilePath=null;

    /**
     * Costruttore della classe LayerTerritorio.
     * 
     * @param configFilePath Path completo e nome del file di configurazione
     * @param logger
     * @param configBean Parametri di configurazione. vedi {link ConfigBean}<br>
     * @param nome Nome da attribuire al layer
     * @param codTPN
     * @param layer ID del layer - Questo parametro non è più utilizzato, visto che idLayer e codTPN sono diventati la stessa cosa. 
     *                             Non è stato rimosso perchè avrebbe impatto sui costruttori di tutte le classi.
     * @param nomiCampi ashMap contenere coppie nomi simbolici campi - nomi effettivi. </br>
     * Tale associazione e' letta dal file di configurazione da {@link LayerTerritorio#initNomiCampi(java.util.Properties pr, java.lang.String ente, java.lang.String nomeLayer)}
     */
    public LayerTerritorio(String configFilePath, 
            LogInterface logger,
            ConfigBean configBean,
            String nome,
            int codTPN,
            int layer, HashMap<String, String> nomiCampi) {

        initLayer(configFilePath, logger, configBean, nome, codTPN);        
        this.NomiCampi = nomiCampi;
    }

    /**
     * Costruttore di default
     */
    public LayerTerritorio() { 

    }

    /**
     * Metodo che crea e restituisce una istanza della classe che rappresenta un oggetto contenuto dal layer. <br/>
     * Per esempio per il layer sinistri il metodo restituisce un puntoSinistro. In questo caso l'implementazione sarà<br/> 
     * <br/>
     * <pre>
     * protected OggettoTerritorio creaOggetto(SimpleFeature curFeat) {
     *   return new PuntoSinistro(logger, this, curFeat);
     * }
     * </pre>
     * @param curFeat
     */
    protected  abstract OggettoTerritorio creaOggetto(SimpleFeature curFeat);


    /**
     * Chiamata in fase di inizializzazione per inizializzare i campi (attributi) disponibili per questo layer e la loro corrispondenza con i nomi logici utilizzati nel file di configurazione</br>
     * Deve essere implementata da ogni singolo layer con i suoi attributi specifici</br>
     * Tipicamente contiene un certo numero di chiamate al metodo addnomicampi (uno per la chiave primaria ed uno per ogni attributo) come nel seguente esempio</br>  
     * <br/>
     * addnomicampi(pr,ente,nomeLayer, Costanti.NL_IDTPN);
     * addnomicampi(pr,ente,nomeLayer, Costanti.NL_SINISTRI_NSINISTRO);
     * 
     * @param pr
     * @param ente
     * @param nomeLayer
     */
    protected abstract void initNomiCampi(Properties pr, String ente, String nomeLayer);

    /**
     * @param pr
     * @param ente
     * @param nomeLayer
     */
    protected void initNomiCampiFull(Properties pr, String ente, String nomeLayer) {
        initNomiCampi(pr, ente, nomeLayer);
    }   

    /**
     * Ritorna la stringa che viene utilizzata da questo layer come prefisso nel file di configurazione 
     */
    public abstract String getConfigPrefix( ) ;

    /**
     * I singoli layer devono sovrascrivere questa funzione per registrare funzioni di ricerca poi disponibili
     * tramite la funzione {@link LayerTerritorio#cerca(Integer, Object[])}
     * <br/>
     * <br/> 
     * Per esempio:
     * addRicerca(1, "Circoscrizione", "cercaCircoscrizione", "Nome Circoscrizione");
     * 
     */
    protected void initRicerche() throws SITException {};    


    @Deprecated 
    public String ricercaSuggest (int idRicerca, int nCampo, Object...valori) throws SITException  {
        return "";
    }

    /**
     * Metodo da implementare nelle classi che estendono questa per implementare le funzioni di suggest
     * 
     * @param idRicerca ID della ricerca c
     * @param nCampo numero del campo per il quale si chiede la suggest
     * @param withGeometry indica se inserire nella risposta anche la geometria
     * @param valori elenco dei valori contenuti nei campi di ricerca
     * @param chiavi elenco delle chiavi (se definite) dei valori dei campi di ricerca. Un esempio è la ricerca per via e civico, con suggest su entrambe. 
     *               Alla suggest del civico vengono passate sia il codice della via che quello del civico
     * @return
     * @throws SITException
     */
    public JSGeometryArrayList<? extends JSGeometry> ricercaSuggest2 (int idRicerca, int nCampo, boolean withGeometry, Object[] valori, Object[] chiavi) throws SITException  {
        return ricercaSuggest2 (idRicerca, nCampo, withGeometry, valori);
    }
    
    /**
     * Metodo da implementare nelle classi che estendono questa per implementare le funzioni di suggest, nel caso che non interessino le chiavi (@see {@link LayerTerritorio#ricercaSuggest2(int, int, boolean, Object[], Object[])}
     * 
     * @param idRicerca ID della ricerca c
     * @param nCampo numero del campo per il quale si chiede la suggest
     * @param withGeometry indica se inserire nella risposta anche la geometria
     * @param valori elenco dei valori contenuti nei campi di ricerca
     * @return
     * @throws SITException
     */
    public JSGeometryArrayList<? extends JSGeometry> ricercaSuggest2 (int idRicerca, int nCampo, boolean withGeometry, Object...valori) throws SITException  {
        return new JSGeometryArrayList<JSGeometry>(logger);
    }

    /** 
     * @param id
     * @param nomeRicerca
     * @param nomeMetodo
     * @param tipoCampi
     * @param nomiCampi
     * @throws SITException
     * 
     * @see {@link LayerTerritorio#addRicerca(Integer id, String nomeRicerca, String nomeMetodo, Class<?>[] tipoCampi, Boolean[] suggestDisponibile, Integer[] suggestMinLength, String... nomiCampi)}
     */
    public void addRicerca(Integer id, String nomeRicerca, String nomeMetodo, Class<?>[] tipoCampi, String...nomiCampi ) throws SITException{        
        addRicerca( id, nomeRicerca, nomeMetodo,  tipoCampi, null, null, nomiCampi );    
    }

    /**
     * Aggiunge una tipologia di ricerca sul layer.
     *
     * @param id
     * @param nomeRicerca
     * @param nomeMetodo
     * @param tipoCampi
     * @param suggestDisponibile
     * @param suggestMinLength
     * @param nomiCampi
     * @throws SITException
     */
    public void addRicerca(Integer id, String nomeRicerca, String nomeMetodo, Class<?>[] tipoCampi, Boolean[] suggestDisponibile,
            Integer[] suggestMinLength, String...nomiCampi ) throws SITException{

        Boolean[] required= new Boolean[nomiCampi.length];
        for(int i= 0; i < required.length; i++){
            required[i]= true;
        }
        addRicerca( id, nomeRicerca, nomeMetodo,  tipoCampi, suggestDisponibile, suggestMinLength, required, nomiCampi ); 
    }

    /**
     * Aggiunge una ricerca.
     * 
     * @param id Id della ricerca
     * @param nomeRicerca Nome della ricerca
     * @param nomeMetodo nome del metodo che implementa la ricerca
     * @param campiricerca lista dei campi che compongono il filtro 
     * @throws SITException Eccezione rilanciata in caso di errori
     */
    public void addRicerca(Integer id, String nomeRicerca, String nomeMetodo, 
    						List<RicercaCampo> campiricerca ) throws SITException{       
    	addRicerca(id, nomeRicerca, nomeMetodo, campiricerca, false ); 
    }
    
    /**
     * Aggiunge una ricerca.
     * 
     * @param id Id della ricerca
     * @param nomeRicerca Nome della ricerca
     * @param nomeMetodo nome del metodo che implementa la ricerca
     * @param campiricerca lista dei campi che compongono il filtro 
     * @param geomFilterAvailable indica se per questa ricerca il filtro geografico deve essere disponibile
     *   Nel caso che sia true in fase di ricerca il parametro contenente la geometria di filtro sarà passato 
     *   come primo argomento al metodo {@link LayerTerritorio#initRicerche()} 
     * @throws SITException Eccezione rilanciata in caso di errori
    */
    public final void addRicerca(final Integer id, final String nomeRicerca, 
    							 final String nomeMetodo, final List<RicercaCampo> campiricerca, 
    							 final Boolean geomFilterAvailable ) throws SITException{       
        MetadatoRicerche mr;
        try {   
        	
        	int nCampi = campiricerca.size();
    		Class<?>[] tipiCampi = new Class<?>[nCampi];
    		String[] etichetteCampi = new String[nCampi];
    		String[] NLCampi = new String[nCampi];
    		Boolean[] required = new Boolean[nCampi];
    		Boolean[] suggestDisponibile = new Boolean[nCampi];
    		Integer[] suggestMinLength = new Integer[nCampi];
    		
    		for (int i = 0 ; i < campiricerca.size(); i++) {
    			tipiCampi[i] 	  		= campiricerca.get(i).getTipo();
    			etichetteCampi[i] 		= campiricerca.get(i).getEtichetta();
    			NLCampi[i] 		  		= campiricerca.get(i).getNLCampo();
    			required[i]		  		= campiricerca.get(i).getRequired();
    			suggestDisponibile[i] 	= campiricerca.get(i).getSuggestDisponibile();
    			suggestMinLength[i] 	= campiricerca.get(i).getSuggestMinLength();
    		};
        	
        	mr = new MetadatoRicerche(id, nomeRicerca, nomeMetodo, this.getClass(), campiricerca);
        	if (geomFilterAvailable!=null) {
        		mr.setGeomFilterAvailable(geomFilterAvailable);
        	}
            ricerche.put(mr.getId(), mr);
        } catch (SecurityException e) {
            logger.warn("LayerTerritorio.addRicerca: exception SecurityException", e);
            throw new SITException("LayerTerritorio.cerca: exception SecurityException durante la ricerca.  ", e);
        } catch (NoSuchMethodException e) {
            logger.warn("LayerTerritorio.addRicerca: exception NoSuchMethodException.", e);
            throw new SITException("LayerTerritorio.cerca: exception NoSuchMethodException durante la ricerca.  ", e);
        }
    }
    
    /**
     * Aggiunge una tipologia di ricerca sul layer.
     * 
     * @param id Id della ricerca
     * @param nomeRicerca Nome della ricerca
     * @param nomeMetodo nome del metodo che implementa la ricerca
     * @param tipoCampi tipo dei campi di ricerca
     * @param suggestDisponibile vettore che indica se per i sindoli campi deve essere risponibile il suggest
     * @param suggestMinLength vettore che indica la lunghezza minima per attivare il suggest
     * @param required vettore che indica quali campi sono obbligatori
     * @param nomiCampi nomi dei campi da visualizzare a video
     * @throws SITException Eccezione rilanciata in caso di errori
     */
    public void addRicerca(Integer id, String nomeRicerca, String nomeMetodo, 
    					Class<?>[] tipoCampi, Boolean[] suggestDisponibile, 
    					Integer[] suggestMinLength, Boolean[] required, String...nomiCampi ) 
    			throws SITException{       
    	
    	addRicerca(id, nomeRicerca, nomeMetodo, tipoCampi, suggestDisponibile, 
                 suggestMinLength, required, false, nomiCampi );
    	
    }

    /**
     * Aggiunge una tipologia di ricerca sul layer.
     * 
     * @param id Id della ricerca
     * @param nomeRicerca Nome della ricerca
     * @param nomeMetodo nome del metodo che implementa la ricerca
     * @param tipoCampi tipo dei campi di ricerca
     * @param suggestDisponibile vettore che indica se per i sindoli campi deve essere risponibile il suggest
     * @param suggestMinLength vettore che indica la lunghezza minima per attivare il suggest
     * @param required vettore che indica quali campi sono obbligatori
     * @param geomFilterAvailable indica se per questa ricerca il filtro geografico deve essere disponibile.
     * Nel caso che sia true in fase di ricerca il parametro contenente la geometria di filtro sarà passato 
     * come primo argomento al metodo {@link LayerTerritorio#initRicerche()} 
     * @param nomiCampi nomi dei campi da visualizzare a video
     * @throws SITException
     */
    public final void addRicerca(final Integer id, final String nomeRicerca, final String nomeMetodo, 
    		final Class<?>[] tipoCampi, final Boolean[] suggestDisponibile, 
            final Integer[] suggestMinLength, final Boolean[] required, 
            final Boolean geomFilterAvailable, final String...nomiCampi ) throws SITException{       
        Method met;
        try {   
        	MetadatoRicerche ric ;
        	met = (nomeMetodo!=null) ? this.getClass().getMethod(nomeMetodo, tipoCampi) : null;
        	ric = new MetadatoRicerche(id, nomeRicerca, met,  tipoCampi, suggestDisponibile, suggestMinLength, required, nomiCampi  );
        	if (geomFilterAvailable!=null) {
        		ric.setGeomFilterAvailable(geomFilterAvailable);
        	}
            ricerche.put(ric.getId(), ric);
        } catch (SecurityException e) {
            logger.warn("LayerTerritorio.addRicerca: exception SecurityException", e);
            throw new SITException("LayerTerritorio.cerca: exception SecurityException durante la ricerca.  ", e);
        } catch (NoSuchMethodException e) {
            logger.warn("LayerTerritorio.addRicerca: exception NoSuchMethodException.", e);
            throw new SITException("LayerTerritorio.cerca: exception NoSuchMethodException durante la ricerca.  ", e);
        }
    }

    public static Object[] castArgsToTypes (Class<?>[] clparam, Object... args ) throws SITException {
    	
    	  // ///////////////////////////////////////
        // CONTROLLO DEGLI ARGOMENTI PASSATI
        // ///////////////////////////////////////

        int numParRichiesti = (clparam == null) ? 0 : clparam.length;
        int numParPassati = (args == null) ? 0 : args.length; 

        // /////////////////////////////////////////////////////////////////////////////////
        // SE NUMERO ARGOMENTI PASSATI NON UGUALE A QUELLO DEI RICHIESTI LANCIO ERRORE
        // /////////////////////////////////////////////////////////////////////////////////

        if(numParPassati != numParRichiesti){
            throw new SITException("Numero parametri non corretto: richiesti " + numParRichiesti + " , passati " + numParPassati);
        }

        // //////////////////////////////////////////////////////////////////////////////////////////////////////
        // CONTROLLO CHE OGNI CLASSE DI ARGOMENTO RICHIESTO SIA ASSEGNABILE DA QUELLA PASSATA E SE NON LO E'
        // CHE SIA ALMENO ISTANZIABILE AD ESSA, MEDIANTE UN COSTRUTTORE CHE L'ACCETTA.
        // //////////////////////////////////////////////////////////////////////////////////////////////////////

        Object[] castedArgs = new Object[numParRichiesti];

        for(int i = 0; i < numParRichiesti ; i++){            

            if ( (args[i]!=null) &&  args[i].equals("")) args[i] = null; 
            Class classeRichiesta = clparam[i];
            if ( (args[i]==null) || classeRichiesta.isAssignableFrom(args[i].getClass())){
                castedArgs[i] = args[i];
                continue;
            }

            Class classePassata   = args[i].getClass();
            Constructor<?> c = null;

            try {
                c = classeRichiesta.getConstructor(classePassata);                              
            } catch (NoSuchMethodException nsme) {
                throw new SITException("La classe richiesta (" + classeRichiesta.getName() + ") non può essere ottenuta dalla classe passata (" + classePassata.getName() + ")");
            } 

            try {                                                
                castedArgs[i] = c.newInstance(args[i]);                
            } catch (Exception e) {
                throw new SITException("La classe richiesta (" + classeRichiesta.getName() + ") non è costruibile con la classe passata (" + classePassata.getName() + ")");
            }            
        }
    	
        return castedArgs;
    }

    /**
     * Rende disponibili le funzioni di ricerca registrate attraverso la funzione {@link LayerTerritorio#initRicerche()}
     * invocando il metodo registrato passando i parametri in ingresso.
     * 
     * @param id
     * @param args
     * @return ArrayList
     * @throws SITException
     */
    public ArrayList<OggettoTerritorio> cerca(Integer id,Object... args) throws SITException {

        ArrayList<OggettoTerritorio> retVal = new ArrayList<OggettoTerritorio>();
        MetadatoRicerche ric = ricerche.get(id);

        Method met = ric.getMetodo();

        Class<?>[] clparam = met.getParameterTypes();

        Object[] castedArgs = castArgsToTypes(clparam, args);
        
        Object risultato=null;

        try {
            if (castedArgs!=null) logger.debug(castedArgs.getClass().getName());

            risultato = met.invoke(this, castedArgs);

            if(risultato == null) return retVal;

            if (OggettoTerritorio.class.isAssignableFrom(risultato.getClass())) {
                retVal.add( (OggettoTerritorio) risultato);
            } else if (ArrayList.class.isAssignableFrom(risultato.getClass())) {
                ArrayList<OggettoTerritorio> buff = (ArrayList<OggettoTerritorio>) risultato;
                retVal = buff;
            } else {
                throw new SITException("LayerTerritorio[cerca] Errore durante la ricerca.");
            }
        } catch (IllegalArgumentException e) {
            logger.warn("LayerTerritorio.cerca: exception IllegalArgumentException durante la ricerca.", e);
            throw new SITException("LayerTerritorio.cerca: exception IllegalArgumentException durante la ricerca.", e);
        } catch (IllegalAccessException e) {
            logger.warn("LayerTerritorio.cerca: exception IllegalAccessException durante la ricerca. ", e);
            throw new SITException("LayerTerritorio.cerca: exception IllegalAccessException durante la ricerca.", e);
        } catch (InvocationTargetException e) {
            logger.warn("LayerTerritorio.cerca: exception InvocationTargetException durante la ricerca.", e);
            throw new SITException("LayerTerritorio.cerca: exception InvocationTargetException durante la ricerca. Eccezione originaria:" + e.getTargetException(), e);
        }

        return retVal;
    }

    /**
     * Funzione che restituisce le ricerche possibili sul layer.
     * 
     * @return HashMap<Integer, MetadatoRicerche> ricerche
     */
    public HashMap<Integer, MetadatoRicerche> getRicerche() {
        return ricerche;
    }

    /**
     * Crea l'evento sul giornale.
     * 
     * @param conn
     * @param user
     * @param IPAddress
     * @param idEvento
     * @param cdVariaz
     * @param tpVariazione
     * @return ProgvalType progival
     * @throws BasicException
     */
    public ProgvalType creaEvento(Connection conn, String user, String IPAddress, IdType idEvento, IdType cdVariaz, char tpVariazione ) throws BasicException  {
        EventType evento = new EventType();
        TsType adesso = new TsType();
        evento.setEnte(Integer.parseInt(configBean.getEnte()));
        evento.setProgval(new ProgvalType(adesso));
        evento.setTsEvento(adesso);
        evento.setCdEvento(idEvento);
        evento.setCdVariaz(cdVariaz);
        evento.setTpOperaz(tpVariazione); //EventType.INSERIMENTO
        evento.setUserid(user);
        evento.setTerminale(IPAddress);
        evento.setProgramma("LayerTerritorio.java");

        ProgvalType progival = null;

        try {
            progival = GiornaleDAO.write(evento,conn,logger);
        } catch (SQLException e) {
            throw new BasicException(-1,"Errore inserimento sul Giornale: "+e.getMessage(),e);
        } catch (IOBasicException e) {
            throw e;
        }

        return progival;
    }

    /**
     * Assegna un nuovo ID aggiornando il numeratore.
     * 
     * @param conn
     * @return IdType id
     * @throws SITBasicException
     */
    public IdType getNextId(Connection conn) throws SITBasicException {

        int num = 0;

        try {
            num = NumeratoreDAO.next(Integer.parseInt(configBean.getEnte()),
                    configBean.getStoricoCodiceNumeratore().getIntValue(),
                    0,
                    true,conn,logger);
        } catch (SQLException e) {
            new BasicException(-1,"Errore acquisizione numeratore " + configBean.getEnte()+"/" + configBean.getStoricoCodiceNumeratore() + ": "+e.getMessage(),e);
        } catch (NumberFormatException e) {
            logger.warn("NumberFormatException in getNextId", e);
            throw new SITBasicException(-1, "Errore NumberFormatException " + e.getMessage(), e);
        } catch (IOBasicException e) {
            throw new SITBasicException(-1, "Errore IOBAsicException " + e.getMessage(), e);
        } 

        IdType id = new IdType();
        id.set(Integer.parseInt(configBean.getEnte()),configBean.getStoricoCodiceNumeratore().getIntValue(),num);
        logger.debug("Classe: " + this.getClass().getName() + "- Metodo: getNextId - " + "Numeratore recuperato: " + id.toString());

        return id;
    }


    /**
     * Aggiunge alla lista dei nomi campi (HashMap NomiCampi) una coppia nome 
     * simbolico - nome effettivo leggendola dal file di configurazione (per formato del file vedi {@link it.prato.comune.sit}).
     * Utilizzata principalmente nelle implementazioni di {@link initNomiCampi(java.util.Properties pr, java.lang.String ente, java.lang.String nomeLayer)}  
     * 
     * @param pr properties del file di configurazione
     * @param ente codice ente nel file di configurazione. Per comune di prato e' pari a 001 
     * @param nomeLayer Nome del layer come utilizzato nel file di configurazione
     * @param szNL Nome simbolico del campo. Vedi anche {@link Costanti}
     * 
     * @see Costanti
     * @see it.prato.comune.sit
     */
    protected void addnomicampi(Properties pr, String ente, String nomeLayer, String szNL ) {

        String nomeCampoProp = ente+nomeLayer+szNL;         
        String szProp = pr.getProperty(nomeCampoProp);       

        if (szProp!=null){
            addnomicampi(szNL, szProp);
        } else {
            logger.info(this.getClass().getName() + " nome campo nullo: " + nomeCampoProp);
        }        
    }

    /**
     * Aggiunge alla lista dei nomi campi (HashMap NomiCampi) una coppia nome 
     * simbolico - nome effettivo   
     *      
     * @param szNL Nome simbolico del campo. Vedi anche {@link Costanti}
     * @param szProp Nome effettivo del campo
     * 
     * @see it.prato.comune.sit
     */
    protected void addnomicampi(String szNL, String szProp) {                

        if (szProp!=null){
            String[] szProps = szProp.split("!!");

            switch (szProps.length) {
            case 1: // se presente uno solo allora e' di lettura e scrittura
                this.getNomiCampi().put(szNL, dsCaseSensitiveTransform(szProps[0]));
                this.getNomiCampiScrittura().put(szNL, dsCaseSensitiveTransform(szProps[0]));	
                break;
            case 2: //Se presenti entrambi
                this.getNomiCampi().put(szNL, dsCaseSensitiveTransform(szProps[0]));
                if (!szProps[1].trim().equals("-")){
                    if (szProps[1].trim().equals("*")) {
                        this.getNomiCampiScrittura().put(szNL, dsCaseSensitiveTransform(szProps[0]));
                    } else {
                        this.getNomiCampiScrittura().put(szNL, dsCaseSensitiveTransform(szProps[1]));    
                    }
                } 	
                break;
            }

        } else {
            logger.info(this.getClass().getName() + " nome campo nullo: " + szProp);
        }      

    }

    /**
     * @param pr
     * @param ente
     * @param nomeLayer
     * @param szNL
     * @param prefix
     * @return String[]
     */
    protected String[] addnomicampiExt(Properties pr, String ente, String nomeLayer, String szNL, String prefix) { 
    	String prefixProp = null;
    	if(pr != null && ente != null && nomeLayer != null){
            String nomeCampoProp = ente + nomeLayer + prefix;         
            prefixProp = pr.getProperty(nomeCampoProp);   
    	}else{
    		prefixProp = prefix;
    	}

        if (prefixProp!=null){
        	String prop = null;
        	if(prefixProp.contains("!!")){
        		prop = prefixProp.split("!!")[0];
        	}else{
        		prop = prefixProp;
        	}
        	
        	String[] array = new String[]{szNL, prop};
        	return array;
        } else {
            logger.info(this.getClass().getName() + " nome campo nullo: " + prefixProp);
        }    
        
        return null;
    }
    
    /**
     * @param pr
     * @param ente
     * @param nomeLayer
     * @param szNL
     * @param prefix
     */
    protected void addnomicampiLeggibili(Properties pr, String ente, String nomeLayer, String szNL, String prefix) { 
    	String[] nomiCamiLeggibili = this.addnomicampiExt(pr, ente, nomeLayer, szNL, prefix);
    	if(nomiCamiLeggibili != null){
    		this.getNomiCampiLegibili().put(nomiCamiLeggibili[0], nomiCamiLeggibili[1]); 
    	}
    }

    /**
     * @param pr
     * @param ente
     * @param nomeLayer
     * @param szNL
     * @param prefix
     */
    protected void addnomicampiRegEx(Properties pr, String ente, String nomeLayer, String szNL, String prefix) { 
    	String[] nomicampiRegEx = this.addnomicampiExt(pr, ente, nomeLayer, szNL, prefix);
    	if(nomicampiRegEx != null){
    		this.getAttributiRegEx().put(nomicampiRegEx[0], nomicampiRegEx[1]); 
    	}
    }
    
    /**
     * @param pr
     * @param ente
     * @param nomeLayer
     * @param szNL
     * @param prefix
     */
    protected void addnomicampiReadWrite(Properties pr, String ente, String nomeLayer, String szNL, String prefix) { 
    	String[] nomicampiReadWrite = this.addnomicampiExt(pr, ente, nomeLayer, szNL, prefix);
    	if(nomicampiReadWrite != null){
    		this.getAttributiReadWrite().put(nomicampiReadWrite[0], nomicampiReadWrite[1]); 
    	}
    }
    
    /**
     * @param pr
     * @param ente
     * @param nomeLayer
     * @param szNL
     * @param prefix
     */
    protected void addDefaultValueForField(Properties pr, String ente, String nomeLayer, String szNL, String prefix) { 
    	String[] defaultValues = this.addnomicampiExt(pr, ente, nomeLayer, szNL, prefix);
    	if(defaultValues != null){
    		this.getDefaultAttributeValues().put(defaultValues[0], defaultValues[1]); 
    	}
    }
    
    /**
     * @param pr
     * @param ente
     * @param nomeLayer
     * @param szNL
     * @param prefix
     */
    protected void addnomicampiFk(Properties pr, String ente, String nomeLayer, String szNL, String prefix) { 
    	String[] nomicampiFk = this.addnomicampiExt(pr, ente, nomeLayer, szNL, prefix);
    	if(nomicampiFk != null){
    		String[] fkArray = null;
    		if(nomicampiFk[1].contains(";")){
    			fkArray = nomicampiFk[1].split(";");
    			for(int i=0; i<fkArray.length; i++){
    				String key = fkArray[i];
    				String[] kv = key.split(":");
    				attributiFk.put(kv[0], kv[1].concat(":" + kv[2]));
    			}
    		}else{
				String key = nomicampiFk[1];
				String[] kv = key.split(":");
				attributiFk.put(kv[0], kv[1].concat(":" + kv[2]));
    		}
    	}
    }
    
    /**
     * @param pr
     * @param ente
     * @param nomeLayer
     * @param szNL
     * @param prefix
     */
    protected void addnomicampiDateFormat(Properties pr, String ente, String nomeLayer, String szNL, String prefix) { 
    	String[] nomicampiFk = this.addnomicampiExt(pr, ente, nomeLayer, szNL, prefix);
    	if(nomicampiFk != null){
    		dateFormat = nomicampiFk[1];
    	}else{
    		// Se non definito un formato viene usato come default ISO-8601
    		dateFormat = "YYYY-MM-DDTHH:MM:SSZ";
    	}
    }
    
	/**
	 * @return the attributiTipo
	 * @throws SITException 
	 */
	public HashMap<String, Class<?>> getAttributiTipo() throws SITException {
        DataStore ds = null;

        HashMap<String, Class<?>> attributeTypes = new HashMap<String, Class<?>>();
        try {
            ds = getDataStore();
//            JDBCFeatureStore featureStore = (JDBCFeatureStore) ds.getFeatureSource(configBean.getTypeName());
            SimpleFeatureSource featureSource = ds.getFeatureSource(configBean.getTypeName());            
            SimpleFeatureType sfSchema = featureSource.getSchema();
            
        	Set<Entry<String, String>> attributeKeys = this.NomiCampi.entrySet();
        	Iterator iterator = attributeKeys.iterator();
        	
        	while(iterator.hasNext()){
        		Map.Entry entry = (Map.Entry)iterator.next();
        		
        		String attributeName = (String)entry.getValue();
        		AttributeType attributeType = sfSchema.getType(attributeName);
        		
        		if(attributeType != null){
        			attributeTypes.put((String)entry.getKey(), attributeType.getBinding());
        		}
        	}
        }catch(IOException e){
        	e.printStackTrace();
        }

        return attributeTypes;
	}

     /* 
     * @see {@link Territorio#dsCaseSensitiveTransform(SITDataStorePool dsPool, String dsPoolID,  String inString)}
     */
    private String dsCaseSensitiveTransform(String inString) {        
        return SITLayersManager.dsCaseSensitiveTransform(configBean.getDsPool(), configBean.getDsPoolID(), inString);         
    }

    /**
     * Inizializza il layer usando il file di configurazione.
     * 
     * @param configFilePath
     * @param logger
     * @param configBean
     * @param nome
     * @param codTPN
     * @param layer
     */
    protected void initLayer(String configFilePath, 
            LogInterface logger, 
            ConfigBean configBean,
            String nome, 
            int codTPN) {

        // ///////////////////////////////////////////////////////////
        // [regionstart] Salvataggio in variabili di istanza            
        // [regionend]       
        // Istanzio classe di gestione del log della procedura
        // //////////////////////////////////////////////////////////

        this.configBean = configBean;
        this.logger = logger;
        this.configFilePath = configFilePath;
        Nome    = nome;
        //IDLayer = layer;
        this.codTPN = codTPN;
    }

    protected void setCodTPN(int codTPN) {
    	this.codTPN = codTPN;
    }
    
    /**
     * Metodo che setta la data di inizio e di fine per realizzare un filtro temporale sul layer.
     * 
     * @param dataInizioFiltro
     * @param dataFineFiltro
     */
    public void setFiltroTemporale(TsType dataInizioFiltro, TsType dataFineFiltro) {
        this.dtInizioFiltro = dataInizioFiltro;
        this.dtFineFiltro = dataFineFiltro;
    }

    /**
     * Filtra geograficamente il layer corrente con il filtro definito in TipoFiltro e la geometria del parametro geom 
     *  
     * @param geom  Geometria con la quale filtrare  
     * @param TipoFiltro Tipo di filtro (valori possibili definiti in {@link org.geotools.filter.FilterType} 
     * @return ArrayList contenente gli oggetto trovati
     * @throws IOException 
     * @throws SITException 
     */
    protected ArrayList<OggettoTerritorio> FiltroGeografico (BinarySpatialOperator filter) throws 
    IOException, SITException {

    	/* **************** */
    	if(filtroTotale == null) {
            filtroTotale = this.getFiltroVuoto();
        }

        filtroTotale.AndFiltroPriv(filter); 
        
        return cercaFiltro();
        /* *************** */
    	/* ALE
        ArrayList<OggettoTerritorio> risultato = new ArrayList<OggettoTerritorio>();
        DataStore store = null;        

        try {
            store = getDataStore();
        } catch (IOException e) {
            logger.error("Eccezione durante il recupero del DataStore: " + e.getMessage(), e);            
            throw e;
        } catch (SITException e) {
            logger.warn("Eccezione durante il recupero del DataStore: " + e.getMessage(), e);
            throw e;
        }

        FeatureSource<SimpleFeatureType, SimpleFeature> features  = store.getFeatureSource(configBean.getTypeName());

        if(filtroTotale == null) {
            filtroTotale = this.getFiltroVuoto();
        }

        filtroTotale.AndFiltroPriv(filter);                
        FeatureCollection<SimpleFeatureType, SimpleFeature> col;

        try {
            col = features.getFeatures(filtroTotale.getFiltro());
        } catch (IOException e) {
            logger.error("Eccezione duranre il recupero delle features: " + e.getMessage(), e);            
            throw e;
        }

        FeatureIterator<SimpleFeature> fi = col.features();

        try {
            while (fi.hasNext()) {
                SimpleFeature curFeat = fi.next();
                risultato.add(creaOggetto(curFeat));            
            }
        } catch (Exception e) {
            logger.warn("Eccezione durante l'iterazione delle features " + e.getMessage(), e);
            throw new SITException("SITException durante l'iterazione delle features", e);
        } finally {
            col.close( fi );
        }

        filtroTotale.ResetFiltro();	

        return risultato;        
        */
    }

//  TOB	
//  /**
//  * Ritorna il FIDMapper utilizzato dal datastore corrente e relativo alla tabella corrente
//  * FIDMapper è definito solo per datastore che estendono JDBCDatastore, in caso contrario ritorna null
//  * 
//  * @return il FIDMapper oppure null se il datastore non estende JDBCDataStore
//  * 
//  * @throws SITException
//  * @throws IOException
//  */
//  protected FIDMapper getFIDMapper() throws SITException{

//  try {
//  DataStore ds = getDataStore();
//  if (JDBCDataStore.class.isAssignableFrom(ds.getClass())) {
//  return ((JDBCDataStore) ds).getFIDMapper(getFeatureType().getTypeName());
//  } else {
//  // TODOH Meglio lasciare così o eccezione?
//  return null;
//  }
//  } catch (SITException e) {
//  throw e;
//  } catch (IOException e) {
//  throw new SITException("Eccezione in getFIDMapper", e);
//  }
//  }

    /**
     * Restituisce il datastore. Se non esiste lo crea e lo memorizza nella apposita variabile di istanza
     * Nella creazione utilizzai parametri di istanza precedentemente inizializzati (dataStoreParams)  
     * 
     * @return DataStore il datastore relativo ai parametri inizializzati   
     * @throws SITException 
     */
    protected DataStore getDataStore() throws IOException, SITException{

        logger.debug("Recupero il DataStore...");

        if (datastore == null) {
            try {
                datastore = configBean.getDsPool().getDataStore(configBean);
            } catch (IOException e) {
                logger.error("IOException durante il recupero del DataStore: " + e.getMessage(), e);
                throw e;
            } catch (SITException e) {
                logger.error("SITException durante il recupero del DataStore: " + e.getMessage(), e);
                throw e;
            }    
        }

        return datastore;
    }

    /**
     * Restituisce una connessione JDBC alla data store Oracle.
     * 
     * @param tr
     * @return Connection retVal
     * @throws SITException
     */
    public Connection getJDBCConnection(SITTransaction tr) throws SITException {

        JDBCDataStore ds = null;
        Connection retVal = null;

        try {
            ds = (JDBCDataStore)getDataStore();
//          TOB
//          if ((ds != null) && (SITOracleDatastore.class.isAssignableFrom(ds.getClass()))) {
//          retVal = ((SITOracleDatastore) ds).getConnection(tr);
//          }

            if (ds != null) {
                retVal = ds.getConnection(tr);
            }

        } catch (IOException e) {
            logger.error("IOException durante recupero connessione JDBC", e);
            throw new SITException("IOException durante recupero connessione JDBC", e);
        } catch (SITException e) {
            logger.error("SITException durante recupero connessione JDBC", e);
            throw e;
        }

//      TOB
//      catch (SQLException e) {
//      logger.error("SQLException", e);
//      throw new SITException("Errore di connessione");
//      }

        return retVal;        
    }

    /** 
     * Helper per l'aggiunta condizionale alla lista dei campi su cui effettuare la ricerca<br>
     * Se un campo e' null non viene inserito nella lista di ricerca (non vengono poste quindi condizioni sul suo valore),<br> 
     * Se ha valore ##NULL## viene ricercato con valore null (viene quindi imposta la condizione che il campo sia null
     * 
     * @param campi ArrayList dei nomi dei campi da cercare attuale
     * @param ricerca ArrayList dei valori da cercare attuale
     * @param nome Nome del campo di ricerca da aggiungere
     * @param valore Valore del campo da aggiungere
     */
    @SuppressWarnings("unchecked")
    protected void addRicercaCond (ArrayList campi, ArrayList ricerca, String  nome, String valore) {        
        if (!valore.equals("##QUALSIASI##")) {
            campi.add(nome);
            ricerca.add(valore);
        }
    }

    /**
     * Modifica la feature con autocommit.
     * 
     * @param WKTString
     * @param NomiCampi
     * @param objAttrs
     * @param filter
     * @throws IOException
     * @throws SITException 
     */
    protected void modifyFeatureWKT(String WKTString, ArrayList<String> NomiCampi, ArrayList<Object> objAttrs, 
            Filter  filter) throws IOException, SITException {

        SITDefaultTransaction transaction=null;

        try {
            transaction = new SITDefaultTransaction("handle");
            modifyFeatureWKT(WKTString, 
                    NomiCampi, 
                    objAttrs, 
                    filter,
                    transaction);

            transaction.commit();

        } catch (IOException e) {
            transaction.rollback();
            logger.warn("IOException durante modifica con autocommit della feature " + WKTString, e);
            throw e;
        } catch (SITParseException e) {
            transaction.rollback();
            String warnMsg = "SITParseException durante modifica con autocommit della feature " + WKTString; 
            logger.warn(warnMsg, e);
            throw new SITParseException(warnMsg, e);
        } catch (SITIllegalAttributeException e) {
            String warnMsg = "SITIllegalAttributeException durante modifica con autocommit della feature " + WKTString; 
            logger.warn(warnMsg, e);
            throw new SITIllegalAttributeException(warnMsg, e);
        } catch (SITException e) {
            logger.warn("SITException durante modifica con autocommit della feature " + WKTString, e);
            throw e;
        } finally {
            if(transaction != null){
                transaction.close();
            }
        }        
    }

    /** 
     * Modifica la feature utilizzando una transazione. Non vengono eseguiti rollback e/o commit. 
     * 
     * @param WKTString
     * @param NomiCampi
     * @param objAttrs
     * @param filter
     * @param transaction
     * @throws IOException
     * @throws SITException 
     */
    protected void modifyFeatureWKT(String WKTString, ArrayList<String> NomiCampi, ArrayList<Object> objAttrs, Filter  filter,
            SITTransaction transaction) throws IOException, SITException {

        DataStore ds = null;

        try {
            ds = getDataStore();        

            JDBCFeatureStore featureStore = (JDBCFeatureStore) ds.getFeatureSource(configBean.getTypeNameScrittura());  
            featureStore.setTransaction(transaction);

            SimpleFeatureType sfSchema = featureStore.getSchema();

            ArrayList<AttributeDescriptor> attDesc = new ArrayList<AttributeDescriptor>();
            ArrayList<Object> obj = new ArrayList<Object>();

            if(featureStore.isExposePrimaryKeyColumns()){    
                String pkName = null;
                List<PrimaryKeyColumn> listPK = featureStore.getPrimaryKey().getColumns();

                for (int i=0; i<NomiCampi.size(); i++) {                	
                    for(int y=0; y<listPK.size(); y++){
                        if(listPK.get(y).getName().equalsIgnoreCase(NomiCampi.get(i)))
                            pkName = NomiCampi.get(i);
                    }
                }

//              TOB
//              for (int j=0; j<NomiCampi.size(); j++) {
//              if(pkName != null && !pkName.equalsIgnoreCase(NomiCampi.get(j))){
//              attDesc.add(sfSchema.getDescriptor(NomiCampi.get(j)));
//              obj.add(objAttrs.get(j));
//              }
//              }

                for (int j=0; j<NomiCampi.size(); j++) {            		
                    if(pkName != null){
                        if(!pkName.equalsIgnoreCase(NomiCampi.get(j))){
                            attDesc.add(sfSchema.getDescriptor(NomiCampi.get(j)));
                            obj.add(objAttrs.get(j));
                        }
                    }else{
                        attDesc.add(sfSchema.getDescriptor(NomiCampi.get(j)));
                        obj.add(objAttrs.get(j));
                    }
                }

            }else{
                for (int j=0; j<NomiCampi.size(); j++) {
                    attDesc.add(sfSchema.getDescriptor(NomiCampi.get(j)));
                    obj.add(objAttrs.get(j));
                }
            }  	

            featureStore.modifyFeatures(attDesc.toArray(new AttributeDescriptor[attDesc.size()]), obj.toArray(), filter);

//          TOB        	 	
//          FeatureWriter<SimpleFeatureType, SimpleFeature> fw = ds.getFeatureWriter(configBean.getTypeNameScrittura(), filter, transaction);

//          while (fw.hasNext()) {

//          SimpleFeature f = fw.next();

//          for (int i=0;i<NomiCampi.size();i++) {
//          f.setAttribute((String)NomiCampi.get(i), objAttrs.get(i));
//          }

//          if (WKTString!=null){ 
//          WKTReader wktReader = new WKTReader();
//          Geometry geometry = (Geometry) wktReader.read(WKTString);   
//          f.setDefaultGeometry(geometry);
//          }

//          fw.write();    
//          }

//          fw.close();

        }catch (IOException e) {
            logger.warn("IOException durante modifica con transazione della feature " + WKTString, e);
            throw e;
        }
//      TOB
//      catch (ParseException pae) {
//      logger.warn("Classe: " + this.getClass().getName() + " Metodo: modifyFeatureWKT - PARSEException  - Messaggio "+ pae.getMessage());
//      logger.warn("Stringa KWT = " + WKTString);
//      throw new SITParseException(pae.getMessage(), pae);
//      }
        catch (IllegalAttributeException e) {
            String warnMsg = "IOException durante modifica con transazione della feature " + WKTString;
            logger.warn(warnMsg, e);
            throw new SITIllegalAttributeException(warnMsg, e);
        }catch (SITException e) {
            logger.warn("SITException durante modifica con transazione della feature " + WKTString, e);
            throw e;
        }
    }

    /**
     * Ricerca i poligoni sulla base dei parametri passati come argomento (nomi degli attributi e valori).
     * 
     * @param NomiCampi
     * @param Valori
     * @return ArrayList
     * 
     * @see {@link LayerTerritorio#cercaPoligoniLike (ArrayList NomiCampi, ArrayList Valori, SITTransaction transaction)}
     */
    protected ArrayList cercaPoligoniLike(ArrayList NomiCampi, ArrayList Valori) {
        return cercaPoligoniLike(NomiCampi, Valori, null);
    }

    /**
     * @param NomiCampi
     * @param Valori
     * @return ArrayList
     * 
     * @see {@link LayerTerritorio#cercaPoligoni (ArrayList NomiCampi, ArrayList Valori, SITTransaction transaction)}
     */
    protected ArrayList cercaPoligoni(ArrayList NomiCampi, ArrayList Valori) {
        return cercaPoligoni(NomiCampi, Valori, null);
    }

    /**
     * Ricerca i poligoni sulla base dei parametri passati come argomento (nomi degli attributi e valori).
     * 
     * @param NomiCampi
     * @param Valori
     * @return ArrayList
     */
    protected ArrayList cercaPoligoni(ArrayList NomiCampi, ArrayList Valori, SITTransaction transaction ) {
    	return new ArrayList(cercaPoligoni(NomiCampi, Valori, transaction, null, null, null).getResult());
    }
    
    /**
     * Ricerca i poligoni sulla base dei parametri passati come argomento (nomi degli attributi e valori). Il risultato è 
     * fornito in maniera paginata se propriamente settati maxFeatures (numero elementi nella pagina), startIndex (elemento dal quale partire) 
     * ed ordinata se settato sortFields. 
     * La ricerca viene effettuata mettendo in AND le espressioni campi = valori
     * 
     * @param NomiCampi Elenco dei nomi di campi che compongono la query
     * @param Valori    Elenco dei valori 
     * @param transaction Transazione all'interno della quale fare la ricerca. Se null viene istanziata una transazione 
     * @param maxFeatures Lunghezza della pagina
     * @param startIndex Indice primo elemento
     * @param sortFields Campi di ordinamento
     * @return
     */
    protected SITPaginatedResult cercaPoligoni(ArrayList NomiCampi, ArrayList Valori, SITTransaction transaction, Integer maxFeatures, Integer startIndex, SortItem[] sortFields ) {

    	SITPaginatedResult retpol = null;

        try {
            Iterator iterator = NomiCampi.iterator();
            int i=0;

            while (iterator.hasNext()) {                    
                String element = (String) iterator.next();

                if(filtroTotale == null)
                    filtroTotale = this.getFiltroVuoto();

//              TOB					
//filtroTotale.AndFiltro(element, Valori.get(i), FilterType.COMPARE_EQUALS );
                String nomeCampo = filtroTotale.getNomeCampo(element);
                filtroTotale.AndFiltro(SITFilterFactory.equals(nomeCampo, Valori.get(i)));
                i++;
            }

            retpol = cercaFiltro(transaction, maxFeatures, startIndex,  sortFields ) ;                
        } catch (Exception e) {                
            logger.error("Errore durante la ricerca dei poligoni: " + e.getMessage(), e);
        }

        filtroTotale.ResetFiltro();		
        filtroTotale = null;
        return retpol;
    }

    /**
     * Ricerca i poligoni sulla base dei parametri passati come argomento (nomi degli attributi e valori).
     * 
     * @param NomiCampi
     * @param Valori
     * @return
     */
    protected ArrayList cercaPoligoniLike(ArrayList NomiCampi, ArrayList Valori, SITTransaction transaction) {
    	return new ArrayList(cercaPoligoniLike(NomiCampi, Valori, transaction, null, null, null).getResult());
    }
    
    /**
    * Ricerca i poligoni sulla base dei parametri passati come argomento (nomi degli attributi e valori). Il risultato è 
    * fornito in maniera paginata se propriamente settati maxFeatures (numero elementi nella pagina), startIndex (elemento dal quale partire) 
    * ed ordinata se settato sortFields. 
    * La ricerca viene effettuata mettendo in AND le espressioni campi like valori
    * 
    * @param NomiCampi Elenco dei nomi di campi che compongono la query
    * @param Valori    Elenco dei valori 
    * @param transaction Transazione all'interno della quale fare la ricerca. Se null viene istanziata una transazione 
    * @param maxFeatures Lunghezza della pagina
    * @param startIndex Indice primo elemento
    * @param sortFields Campi di ordinamento
    **/
    protected SITPaginatedResult cercaPoligoniLike(ArrayList NomiCampi, ArrayList Valori, SITTransaction transaction,  Integer maxFeatures, Integer startIndex, SortItem[] sortFields) {
    	SITPaginatedResult retpol= null;
 
        try {

            Iterator iterator = NomiCampi.iterator();
            int i=0;

            while (iterator.hasNext()) {

                String element = (String) iterator.next();

                if(filtroTotale == null){
                    filtroTotale = this.getFiltroVuoto();
                }

                String nomeCampo = filtroTotale.getNomeCampo(element);
                //String val = Valori.get(i).toString().replaceAll("'", "''");
                String val = Valori.get(i).toString();
                val = SITFilterFactory.escapeOriginalValue(val);
                filtroTotale.AndFiltro(SITFilterFactory.like(nomeCampo, 
                        "%" + val + "%" , false));

                i++;
            }
            retpol = cercaFiltro(transaction, maxFeatures, startIndex, sortFields) ;
        } catch (Exception e) {                
            logger.error("Eccezione durante ricerca con like di oggetti cartografici",e);
        }

        filtroTotale.ResetFiltro();        
        return retpol;
    }

    /**
     * Ricerca un poligono sulla base dei parametri passati come argomento.
     * 
     * @param NomiCampi
     * @param Valori
     * @return OggettoTerritorio
     * 
     * @see {@link LayerTerritorio#cercaPoligono(ArrayList NomiCampi, ArrayList Valori, SITTransaction transaction)}
     */
    protected OggettoTerritorio cercaPoligono(ArrayList NomiCampi, ArrayList Valori) {
        return cercaPoligono(NomiCampi, Valori, null);
    }

    /**
     * Ricerca un poligono sulla base dei parametri passati come argomento.
     * 
     * @param NomiCampi
     * @param Valori
     * @return OggettoTerritorio
     */
    protected OggettoTerritorio cercaPoligono(ArrayList NomiCampi, ArrayList Valori, SITTransaction transaction) {
        ArrayList<OggettoTerritorio> res = new ArrayList<OggettoTerritorio>();

        res = cercaPoligoni(NomiCampi, Valori, transaction);
        if (res!=null && res.size()==1) {
            return (OggettoTerritorio) res.get(0);
        } else {
            return null;
        }
    }    

    /**
     * Scrive un lista di features usando il data store passato come argomento. Attenzione: gli schemi devono essere identici
     *  
     * @param ds
     * @param Feats
     * @throws SITIllegalAttributeException
     * @throws IOException
     */
    protected void CopiaSuDs(DataStore ds, ArrayList<? extends OggettoTerritorio> Feats) throws SITIllegalAttributeException, IOException {

        if (Feats.size()!=0) {

            try {
            	
            	String typeName = configBean.getTypeName();
            	            	            	
            	if(ds.getTypeNames() != null && ds.getTypeNames().length == 1){
            		typeName = ds.getTypeNames()[0];
            	}
            	
                FeatureWriter<SimpleFeatureType, SimpleFeature> aWriter = ds.getFeatureWriterAppend(typeName,
                        ((FeatureStore<SimpleFeatureType, SimpleFeature>) ds.getFeatureSource(typeName))
                        .getTransaction());

                // ///////////////////////////////////
                // per tutti gli oggetti nella lista
                // ///////////////////////////////////

                Iterator<? extends OggettoTerritorio> iter = Feats.iterator();
                for (;iter.hasNext();) {
                    OggettoTerritorio element = (OggettoTerritorio) iter.next();

                    SimpleFeature f = element.getFeat();

                    SimpleFeature aNewFeature = aWriter.next();

                    // ///////////////////////////////////////////////////
                    // copio tutti i campi (gli schemi sono identici)
                    // ///////////////////////////////////////////////////

                    for (int i=0; i<f.getAttributeCount(); i++) {
                        aNewFeature.setAttribute(i,f.getAttribute(i));
                    }

                    aNewFeature.setDefaultGeometry(f.getDefaultGeometry());                    
                    aWriter.write();
                }

                aWriter.close();

            } catch (IOException e) {
                logger.error("IOException durante copia delle features su DataStore passato",e);
                throw e;
            } catch (IllegalAttributeException e) {
                String warnMsg = "IllegalAttributeException durante copia delle features su DataStore passato";
                logger.warn(warnMsg,e);
                throw new SITIllegalAttributeException(warnMsg,e);
            }            
        }        
    }

    /**
     * Crea uno Shapefile data store usando il path del file passato come argomento.
     * 
     * @param szNomeFile
     * @return DataStore
     * @throws IOException
     * @throws SITException
     */
    protected DataStore CreaSHPDsComp (String szNomeFile) throws IOException, SITException {        
        return CreaSHPDsComp(new File(szNomeFile));
    }

    /**
     * Crea uno Shapefile data store usando il file passato come argomento.
     * 
     * @param szFile
     * @return DataStore
     * @throws IOException
     * @throws SITException
     */
    protected DataStore CreaSHPDsComp(File szFile) throws IOException, SITException {

        String dsParams = "url;";
        URL anURL;

        try {
            anURL = szFile.toURL();
        } catch (MalformedURLException e) {
            logger.error("Non e' stato possibile creare l'URL per il file " + szFile.getPath(),e);
            throw e;
        }

        dsParams += anURL;          
        DataStore newDs;

        try {
            newDs = CreaDsComp(dsParams, "org.geotools.data.shapefile.ShapefileDataStoreFactory", false);
        } catch (IOException e) {
            logger.error("IOException durante creazione shape DataStore",e);
            throw e;
        } catch (SITSchemaException e) {
            logger.error("SITSchemaException durante creazione shape DataStore",e);
            throw e;
        } catch (SITException e) {
            logger.warn("SITException durante creazione shape DataStore",e);
            throw e;
        }

        return newDs;
    }

    /**
     * Restituisce un data store usando i parametri passati come argomento.
     *  
     * @param szDataStoreParams i parametri utili per la creazione del data store 
     * @param szDataStoreFactory nome completo del data store factory. 
     * @param isConHints
     * @return DataStore
     * @throws IOException
     * @throws SITException
     */
    protected DataStore CreaDsComp (String szDataStoreParams, 
            String szDataStoreFactory, boolean isConHints) throws IOException, SITException {

        DataStore ds = null;
        DataStore newds = null;
        SimpleFeatureType sch = null;

        try {
            ds = getDataStore();      
        } catch (IOException e) {
            logger.error("IOException durante creazione DataStore",e);
            throw e;
        } catch (SITException e) {
            logger.warn("SITException durante creazione shape DataStore",e);
            throw e;
        }

        try {
            sch = ds.getSchema(configBean.getTypeName());
        } catch (IOException e) {
            logger.error("Eccezione durante recupero dello schema per " + configBean.getTypeName(),e);
            throw e;
        }

//      TOB        
//      AttributeType attyp = null;

//      FeatureTypeBuilder ft = FeatureTypeBuilder.newInstance(sch.getTypeName());

//      //scorro tutti gli attributi lo schema per trasformare attributi BigDecimal in double 
//      for (int i=0; i<sch.getAttributeCount();i++) {
//      attyp= sch.getAttributeType(i);

//      if ( attyp.getType() == BigDecimal.class) {
//      AttributeType attyp1 = AttributeTypeFactory.newAttributeType(attyp.getName(), 
//      Double.class, attyp.isNillable());
//      ft.addType(attyp1);
//      } else  {
//      ft.addType(attyp);
//      }
//      }

        AttributeDescriptor attyp = null;
        SimpleFeatureTypeBuilder builder = new SimpleFeatureTypeBuilder();
        builder.setName(sch.getName());

        // //////////////////////////////////////////////
        // scorro tutti gli attributi lo schema per 
        // trasformare attributi BigDecimal in double.
        // //////////////////////////////////////////////

        for (int i=0; i<sch.getAttributeCount();i++) {
            attyp= sch.getDescriptor(i);

            if ( attyp.getType().getBinding() == BigDecimal.class) {
                builder.add(attyp.getLocalName(), Double.class);
                builder.nillable(attyp.isNillable());
            }else if(attyp.getType().getBinding() == Geometry.class){
                switch(this.getContentTypeLayer()){
                case LAYER_OF_POINTS:
                    builder.add(attyp.getLocalName(), MultiPoint.class);
                    break;
                case LAYER_OF_LINES:
                    builder.add(attyp.getLocalName(), MultiLineString.class);
                    break;
                case LAYER_OF_POLYGONS:
                    builder.add(attyp.getLocalName(), MultiPolygon.class);
                    break;
                default:
                    String exc = "Eccezione SITException tipo di geometria non implementato";
                logger.error(exc);
                throw new SITException(exc);                		
                }             	
            }else{
                builder.add(attyp);
            }
        }

        try {

            newds = configBean.getDsPool().openDataStore(szDataStoreParams, 
                    szDataStoreFactory, isConHints);

            newds.createSchema(builder.buildFeatureType());

        }  catch (IOException e) {
            logger.error("IOException durante creazione DataStore",e);
            throw e;
        }

        return newds;        
    }

    /**
     * Copia su Shapefile un insieme di features creando uno zip file come risultato.
     * 
     * @param outFile
     * @param shpname
     * @param oggettiDaCopiare
     * @return boolean 
     * @throws IOException
     * @throws SITException
     */
    public boolean CopiaSuSHPZip(File outFile, String shpname, ArrayList<? extends OggettoTerritorio> oggettiDaCopiare) throws IOException, SITException {
        String shpFile = null;

        try {

            String outPath = outFile.getParent();
            shpFile = outPath + File.separator + shpname;

            logger.debug("Inizio creazione zip per shape file " + shpFile + "...");

            /*if (shpname == null) {
                shpFile = File.createTempFile("shptmp", ".shp").getAbsolutePath();    
            } else {
                shpFile = shpname;
            }*/


            if (oggettiDaCopiare.size()>0) {

                CopiaSuSHP(shpFile , oggettiDaCopiare);

                // ////////////////////////////
                // tolgo estensione (.shp)
                // ////////////////////////////

                String szBaseName = shpFile.substring(0, shpFile.length()-4);

                String[] files = new String[5];

                files[0] = szBaseName + ".shp";
                files[1] = szBaseName + ".dbf";
                files[2] = szBaseName + ".shx";
                files[3] = szBaseName + ".prj";
                files[4] = szBaseName + ".fix";

                jZip.compress_file(files,outFile, logger);

                // ////////////////////////////
                // cancellazione dei file
                // ////////////////////////////

                File f = new File(files[0]);
                f.delete();
                f = new File(files[1]);
                f.delete();
                f = new File(files[2]);
                f.delete();
                f = new File(files[3]);
                f.delete();
                f = new File(files[4]);
                f.delete();

                return true;
            } else  {
                return false;
            }

        } catch (SITSchemaException e) {
            logger.error("SITSchemaException durante creazione zip di shape file",e);
            throw e;
        } catch (SITIllegalAttributeException e) {
            logger.error("SITIllegalAttributeException durante creazione zip di shape file",e);
            throw e;
        } catch (IOException e) {
            logger.error("IOException durante creazione zip di shape file",e);
            throw e;
        } catch (SITException e) {
            logger.warn("SITException durante creazione zip di shape file",e);
            throw e;
        }
    }    

    /**
     * Copia un insieme di features su Shapefile usando il nome del file.
     * 
     * @param szNomeFile
     * @param oggettiDaCopiare
     * @throws IOException
     * @throws SITException
     */
    public void CopiaSuSHP (String szNomeFile, ArrayList oggettiDaCopiare) throws IOException, SITException {
        String dsParams = "url;";

        if (oggettiDaCopiare.size()>0) {

            URL anURL;

            try {
                anURL = (new File(szNomeFile)).toURL();
            } catch (MalformedURLException e) {
                logger.error("Non e' stato possibile creare l'URL per il file " + szNomeFile, e);
                throw e;
            }

            dsParams += anURL;              
            DataStore newDs;

            try {
                newDs = CreaDsComp(dsParams,    
                        "org.geotools.data.shapefile.ShapefileDataStoreFactory",        
                        false);
            } catch (IOException e) {
                logger.error("IOException durante creazione DataStore per creare shape file",e);
                throw e;
            } catch (SITSchemaException e) {
                logger.error("SITSchemaException durante creazione DataStore per creare shape file",e);
                throw e;
            } catch (SITException e) {
                logger.warn("SITException durante creazione DataStore per creare shape file",e);
                throw e;
            }

            try {
                CopiaSuDs(newDs, oggettiDaCopiare);
            } catch (SITIllegalAttributeException e) {
                logger.error("SITIllegalAttributeException durante creazione shape file",e);
                throw e;
            } catch (IOException e) {
                logger.error("IOException durante creazione shape file",e);
                throw e;
            }            
        }        
    }

    /**
     * Carica uno Shapefile nel corrispondente schema su DB copiando i valori letti dal file.
     * 
     * @param shpFileName
     * @param trans
     * @throws SITException
     */
    public void LoadSHP(String shpFileName, SITTransaction trans) throws SITException {

        /*FeatureSource source = datastore.getFeatureSource( "road" );
         if(!source instanceof FeatureStore){
         throw Exception("Modification not supported");
         }
         FeatureStore road = (FeatureStore) source;*/        

        DataStore ds = null;
        DataStore dsShp = null;

        try {
            //FilterFactory filterFactory = FilterFactory.createFilterFactory();

            String solonome = (new File(shpFileName)).getName();

            // ///////////////////////
            // Da ricavare il nome 
            // ///////////////////////

            String shpTypeName = solonome.substring(0,solonome.length()-4);

            // /////////////////////////////////////////
            // prendo FeatureStore e setto transazione
            // /////////////////////////////////////////

            ds = getDataStore();
            FeatureSource<SimpleFeatureType, SimpleFeature> fs = ds.getFeatureSource(configBean.getTypeName());   

            if(!(fs instanceof FeatureStore)){
                throw new SITException("Modifiche non consentite sul layer");
            }

            FeatureStore<SimpleFeatureType, SimpleFeature> fst = (FeatureStore<SimpleFeatureType, SimpleFeature>) fs;
            fst.setTransaction(trans);

            // //////////////////////////////
            // Cancellazione dati attuali
            // //////////////////////////////

//          TOB
//          fst.removeFeatures(Filter.NONE);
            fst.removeFeatures(Filter.INCLUDE);

            //fst.removeFeatures(null);

            // /////////////////
            // Apertura shape
            // /////////////////

            String dsParams = "url;";
            URL anURL = (new File(shpFileName)).toURL();
            String shpFactory = "org.geotools.data.shapefile.ShapefileDataStoreFactory";        

            dsParams += anURL;

            dsShp = configBean.getDsPool().openDataStore(dsParams, shpFactory, false) ;

            Query quSHP = new Query(shpTypeName, Filter.INCLUDE);

            FeatureReader<?, SimpleFeature> frShp = dsShp.getFeatureReader(quSHP, trans);

            SimpleFeatureType ftSHP = dsShp.getSchema(shpTypeName);

            FeatureWriter<SimpleFeatureType, SimpleFeature> aWriter = ds.getFeatureWriterAppend(configBean.getTypeName(), trans );

//          TOB
//List attnamesSHP = Schema.names(ftSHP);

            Schema schema = new Schema(GeoTools.getDefaultHints());
            List attnamesSHP = schema.getNames(ftSHP);

            ///////////////////////// configurazione mapping ////////////////
            /*File configFile = new File("c:\\ConfigLoadRu.txt");
            FileInputStream input = null;

            try  
            {
                input = new FileInputStream(configFile);
            } 
            catch (FileNotFoundException e) {
                logger.warn("File " + configFilePath + " non trovato: " + e);
                throw new FileNotFoundException();
            }

            Properties pr = new Properties();

            try   {
                pr.load(input);
            } catch (IOException e) {
                logger.warn("Impossibile leggere il file " + configFilePath + ": " + e);
                throw new IOException();
            }

            String szNL_Geom = pr.getProperty("NL_GEOMETRY");
             */
            /////////////////////////////////////////////////////////////////

            List attnamesDest = attnamesSHP; 
            //List attnamesDest = Schema.names( ds.getSchema(configBean.getTypeName()));  

            // ////////////////////////////////////
            // per tutti gli oggetti nella lista
            // ////////////////////////////////////

            while (frShp.hasNext()) {
                SimpleFeature shpFeat = frShp.next();

                SimpleFeature aNewFeature = aWriter.next();

                // /////////////////////////////////////////////////
                // copio tutti i campi (gli schemi sono identici)
                // /////////////////////////////////////////////////

                for (int i=0; i<attnamesSHP.size(); i++) {
//                  TOB                	
//                  if (!ftSHP.getAttributeType(i).isGeometry()) {
//                  String szAtNameSHP = attnamesSHP.get(i).toString();
//                  String szAtNameDest = attnamesDest.get(i).toString();
//                  aNewFeature.setAttribute(szAtNameSHP ,shpFeat.getAttribute(szAtNameDest));
//                  }

                    if (!(ftSHP.getDescriptor(i).getType().getBinding() == Geometry.class)) {
                        String szAtNameSHP = attnamesSHP.get(i).toString();
                        String szAtNameDest = attnamesDest.get(i).toString();
                        aNewFeature.setAttribute(szAtNameSHP ,shpFeat.getAttribute(szAtNameDest));
                    }
                }

                aNewFeature.setDefaultGeometry(shpFeat.getDefaultGeometry());                
                aWriter.write();
            }

            aWriter.close();    

        } catch (SITException e) {
            String errMsg = "SITException durante caricamento shape file su DB";
            logger.error(errMsg,e);
            throw new SITBasicException(-1, errMsg, e);
        } catch (IOException e) {
            String errMsg = "IOException durante caricamento shape file su DB";
            logger.error(errMsg,e);
            throw new SITBasicException(-1, errMsg, e);
        } catch (NoSuchElementException e) {
            String errMsg = "NoSuchElementException durante caricamento shape file su DB";
            logger.error(errMsg,e);
            throw new SITBasicException(-1, errMsg, e);
        } catch (IllegalAttributeException e) {
            String errMsg = "IllegalAttributeException durante caricamento shape file su DB";
            logger.error(errMsg,e);
            throw new SITBasicException(-1, errMsg, e);
        }
    }

    // [regionend]    
    // [regionstart] Metodi public    

    /**
     * Recupera la connessione verso la base di dati.
     * 
     * @return Connection
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public Connection queryDirettaGetConnection() throws SQLException, ClassNotFoundException {

        Connection conn = null;

        try {
            Class.forName(configBean.getQueryDirettaJdbcDriver());
        } catch(ClassNotFoundException e){
            logger.error("Non e' stato possibile recuperare il driver per " + configBean.getQueryDirettaJdbcDriver(),e);
            throw e;
        }
        try {
            conn = DriverManager.getConnection(configBean.getQueryDirettaJdbcUrl(), configBean.getQueryDirettaUser(), configBean.getQueryDirettaPasswd());
        } catch (SQLException e) {
            logger.error("Errore apertura connesione al database per query diretta", e);
            throw e;
        }

        return conn;        
    }

    /**
     * Chiude una connessione con la base di dati. 
     * 
     * @param conn
     * @throws SQLException
     */
    public void  queryDirettaClose(Connection conn) throws SQLException {

        try {
            if(conn != null){
                conn.close();
                conn = null;
            }
        } catch (SQLException e) {
            logger.error("Errore chiusura connesione al database per query diretta", e);
            throw e;
        }
    }

    /**
     * Chiude il result set risultante da una query diretta alla base di dati.
     * 
     * @param rs
     * @throws SQLException
     */
    public void  queryDirettaCloseRs(ResultSet rs) throws SQLException {

        try {

            Statement st = rs.getStatement();
            st.close();

            if(rs != null){
                rs.close();
                rs = null;
            }

            if(st != null){
                st.close();
                st = null;
            }          
        } catch (SQLException e) {
            logger.error("Errore durante chiusura result set in query diretta", e);
            throw e;
        }
    }

//  /**
//  * Compone una query SQL sulla base dei parametri passati come argomento.
//  * 
//  * @param connection
//  * @param sqlPreWhere
//  * @param sqlWhere
//  * @param sqlPostWhere
//  * @param usaFiltro
//  * @return String
//  * @throws IOException
//  * @throws SITException
//  * @throws SQLException
//  */
//  public PreparedStatement queryDirettaSql(Connection connection, String sqlPreWhere, 
//  String sqlWhere, String sqlPostWhere, boolean usaFiltro) throws IOException, SITException, SQLException {

//  StringBuffer sqlFiltro = new StringBuffer("");

//  OracleFilterToSQL encoderOracle = null;
//  PostgisFilterToSQL encoderPostgis = null;

//  DataStore store = getDataStore();

//  if (usaFiltro) {   
////TOB
////JDBCDataStore jdbc = (JDBCDataStore) getDataStore();
////SQLBuilder sqlBuilder = jdbc.getSqlBuilder(configBean.getTypeName());
////if (filtroTotale != null) {
////try {
////sqlBuilder.sqlWhere(sqlFiltro, filtroTotale.getFiltro());
////} catch (SQLEncoderException e) {
////logger.error("Classe " + this.getClass().getName() + " Metodo queryDiretta - SQLEncoderException " + e.getMessage());
////throw new SITSQLEncoderException(e.getMessage(), e); 
////}
////} 


//  if(store instanceof SITOracleDatastore){
//  if (filtroTotale != null) {
//  encoderOracle = new OracleFilterToSQL(null);
//  try {
//  String filter = encoderOracle.encodeToString(filtroTotale.getFiltro());
//  sqlFiltro.append(filter);
//  } catch (FilterToSQLException e) {
//  logger.error("Classe " + this.getClass().getName() + " Metodo queryDiretta - FilterToSQLException " + e.getMessage());
//  throw new SITSQLEncoderException(e.getMessage(), e); 
//  }
//  }
//  }else if(store instanceof PostgisDataStore){
//  if (filtroTotale != null) {
//  encoderPostgis = new PostgisFilterToSQL(null);
//  try {
//  String filter = encoderPostgis.encodeToString(filtroTotale.getFiltro());
//  sqlFiltro.append(filter);
//  } catch (FilterToSQLException e) {
//  logger.error("Classe " + this.getClass().getName() + " Metodo queryDiretta - FilterToSQLException " + e.getMessage());
//  throw new SITSQLEncoderException(e.getMessage(), e); 
//  }
//  }
//  }
//  }                     

//  StringBuffer sqlWhereTot = new StringBuffer("");

//  if ( !sqlFiltro.equals("") ) {
//  sqlWhereTot.append(" ");
//  sqlWhereTot.append(sqlFiltro.toString());
//  sqlWhereTot.append(" ");
//  } 

//  if (!sqlWhere.equals("")) {
//  if (!sqlWhereTot.equals("")) {
//  sqlWhereTot.append(" AND ");                    
//  }
//  sqlWhereTot.append(sqlWhere);
//  }

//  if (sqlFiltro.equals("")) {
//  sqlWhereTot.append(" WHERE ");
//  sqlWhereTot.append(sqlWhereTot);
//  }        

//  PreparedStatement statement = null;

//  try {
//  String sql = sqlPreWhere + sqlWhereTot.toString() + sqlPostWhere;              
//  Connection sitConn = connection;
//  OracleConnection oracleConnection = (OracleConnection) sitConn;
//  GeometryConverter converter = new GeometryConverter(oracleConnection);

//  if(encoderOracle != null){
//  List<Object> preparedObjects = encoderOracle.getLiteralValues();

//  int listSize = preparedObjects.size();
//  if(listSize > 0){
//  statement = sitConn.prepareStatement(sql);

//  for( int i = 0; i < preparedObjects.size(); i++ ) {
//  Object obj = preparedObjects.get(i);

//  if (obj instanceof Geometry){
//  Geometry geometry = (Geometry)preparedObjects.get(i);
//  STRUCT struct = converter.toSDO(geometry);
//  statement.setObject(i+1, struct);
//  }else{
//  statement.setObject(i+1, obj);
//  }   
//  }
//  }else{
//  statement = sitConn.prepareStatement(sql);
//  }
//  }else{
//  statement = sitConn.prepareStatement(sql);
//  }

//  }catch (SQLException e) {
//  logger.equals("Error preparing SQL query: " + e);
//  throw e;
//  } 

//  return statement;        
//  }

    /**
     * Compone una query SQL sulla base dei parametri passati come argomento.
     * 
     * @param connection
     * @param sqlPreWhere
     * @param sqlWhere
     * @param sqlPostWhere
     * @param usaFiltro
     * @return String
     * @throws IOException
     * @throws SITException
     * @throws SQLException
     */
    public PreparedStatement queryDirettaSql(Connection connection, String sqlPreWhere, 
            String sqlWhere, String sqlPostWhere, boolean usaFiltro) throws IOException, SITException, SQLException {

        StringBuffer sqlFiltro = new StringBuffer("");

        JDBCDataStore store = (JDBCDataStore)getDataStore();
        PreparedStatementSQLDialect dialect = (PreparedStatementSQLDialect) store.getSQLDialect();
        PreparedFilterToSQL encoder = null;

        if (usaFiltro) {       	
            if (filtroTotale != null) {

                encoder = dialect.createPreparedFilterToSQL();

                try {
                    String filter = encoder.encodeToString(filtroTotale.getFiltro());
                    sqlFiltro.append(filter);
                } catch (FilterToSQLException e) {
                    String errMsg = "Errore durante creazione filtro per query diretta";
                    logger.error(errMsg, e);
                    throw new SITSQLEncoderException(errMsg, e); 
                }
            }
        }                     

        StringBuffer sqlWhereTot = new StringBuffer("");

        if ( !sqlFiltro.equals("") ) {
            sqlWhereTot.append(" ");
            sqlWhereTot.append(sqlFiltro.toString());
            sqlWhereTot.append(" ");
        } 

        if (!sqlWhere.equals("")) {
            if (!sqlWhereTot.equals("")) {
                sqlWhereTot.append(" AND ");                    
            }
            sqlWhereTot.append(sqlWhere);
        }

        if (sqlFiltro.equals("")) {
            sqlWhereTot.append(" WHERE ");
            sqlWhereTot.append(sqlWhereTot);
        }        

        PreparedStatement statement = null;

        try {
            String sql = sqlPreWhere + sqlWhereTot.toString() + sqlPostWhere; 

            logger.info("Query: " + sql);

            if(encoder != null){
                List<Object> preparedObjects = encoder.getLiteralValues();

                int listSize = preparedObjects.size();
                if(listSize > 0){
                    statement = connection.prepareStatement(sql);

                    for( int i = 0; i < preparedObjects.size(); i++ ) {
                        Object obj = preparedObjects.get(i);
                        Class binding = encoder.getLiteralTypes().get(i);

                        if (obj instanceof Geometry){
                            Geometry geometry = (Geometry)preparedObjects.get(i);
                            
                            CoordinateReferenceSystem crs = getFeatureType().getCoordinateReferenceSystem();
                            // Inserito controllo perchè almeno su Oracle se il layer non ha SRID impostato ma la geometria si vsi verifica errore
							if (crs!=null) {
								dialect.setGeometryValue(geometry, geometry.getDimension(), geometry.getSRID(), binding, statement, i+1);
							} else {
								dialect.setGeometryValue(geometry, geometry.getDimension(), 0, binding, statement, i+1);
							}
                        }else{
                            dialect.setValue(obj, binding, statement, i+1, connection);
                        }   
                    }
                }else{
                    statement = connection.prepareStatement(sql);
                }
            }else{
                statement = connection.prepareStatement(sql);
            }

        }catch (SQLException e) {
            logger.error("Errore durante preparing sql query diretta",e);
            throw e;
        } 

        return statement;        
    }

    /**
     * Esegue una query diretta alla base di dati usando i parametri passati come argomento.
     * 
     * @param connection
     * @param sqlPreWhere
     * @param sqlWhere
     * @param sqlPostWhere
     * @param usaFiltro
     * @return ResultSet
     * @throws SQLException
     * @throws IOException
     * @throws SITException
     */
    public ResultSet queryDiretta(Connection connection, String sqlPreWhere, String sqlWhere, String sqlPostWhere, 
            boolean usaFiltro ) throws SQLException, IOException, SITException {

        try {

            PreparedStatement statement = queryDirettaSql(connection, sqlPreWhere, sqlWhere, sqlPostWhere, usaFiltro);             
            logger.debug("Eseguo query diretta...");                                                             
            ResultSet results = statement.executeQuery();                            
            return results;

        } catch (SQLException e) {
            logger.error("SQLException durante esecuzione query diretta", e);
            throw e;
        } catch (IOException e) {
            logger.error("IOException durante esecuzione query diretta", e);
            throw e;
        } catch (SITException e) {
            logger.error("SITException durante esecuzione query diretta", e);
            throw e;
        }          
    }

    /**
     * Crea un filtro SIT vuoto per il layer.
     *  
     * @return Filtro
     * @throws SITException
     */
    public Filtro getFiltroVuoto() throws SITException{
        DataStore store = null;

        try {
            store = getDataStore();
            FeatureSource<SimpleFeatureType, SimpleFeature> features = store.getFeatureSource(configBean.getTypeName());
            SimpleFeatureType featureType = features.getFeatures().getSchema();

//          TOB           
//          return new Filtro(featureType,getNomiCampi(),logger);           

            Filtro filtro = null;
            if(getNomiCampi(Layers.NL_DTINIZIOFILTRO)!=null && getNomiCampi(Layers.NL_DTFINEFILTRO)!=null && dtInizioFiltro!=null){
                try{
                    filtro = new FiltroTemporale(featureType,getNomiCampi(),dtInizioFiltro,dtFineFiltro,logger);
                }catch(SITRuntimeException e){
                    new SITException("Errore durante costruzione del filtro", e);
                }
            }else{
                filtro = new Filtro(featureType,getNomiCampi(),logger);
            }

            filtro.ResetFiltro();
            return filtro;

        } catch (IOException e) {
            logger.error("IOException durante costruzione del filtro",e);
            return null;
        } catch (SITException e) {
            logger.warn("SITException durante costruzione del filtro", e);
            throw e;
        }
    }

    /**
     * Imposta il filtro SIT del layer.
     * 
     * @param filtro
     */
    public void setFiltro(Filtro filtro){
        filtroTotale = filtro;
    }

    /**
     * Ritorna il numero di features selezionate grazie al filtro SIT del layer.
     * 
     * @return int
     */
    public int getCountFiltro() {
        DataStore store = null;
        int iRet=-1;        

        try {
            store = getDataStore();        
            FeatureSource<SimpleFeatureType, SimpleFeature> features = store.getFeatureSource(configBean.getTypeName());            
            Query query = new Query(configBean.getTypeName(), filtroTotale.getFiltro());            
            iRet = features.getCount(query);
 
            if( iRet == -1 ){
        	  // Information was not available in the header!
        	  SimpleFeatureCollection collection = (SimpleFeatureCollection) features.getFeatures( query );
        	  iRet = collection.size();
        	}

        } catch (Exception e) {                
            logger.error("Eccezione durante tentativo di recuperare il numero delle features",e);
        }

        return iRet;
    }

    /**
     * Applica il filtro SIT del layer per ottenere le features risultanti.
     * 
     * @return ArrayList
     * @throws SITException
     */
    public ArrayList cercaFiltro() throws SITException{
        ArrayList<OggettoTerritorio> retpol = new ArrayList<OggettoTerritorio>();

        try{
            retpol = cercaFiltro(null);
        }catch(SITException e){
            logger.error("SITException durante applicazione del filtro SIT", e);
            throw e;
        }

        return retpol;
    }

    
    /**
     * Utilizza il filtro SIT del layer per ottenere le features risultanti.
     * 
     * @param transaction
     * @return ArrayList
     * @throws SITException
     */
    public ArrayList cercaFiltro(SITTransaction transaction) throws SITException {        
        return new ArrayList(cercaFiltro( transaction,null, null,null).getResult());			
    }
    
    /**
     * Sulla base dei parametri passati come argomento applica il filtro 
     * SIT del layer per ottenere le features risultanti.
     * 
     * @return ArrayList
     * @throws SITException
     */
    //public ArrayList cercaFiltro(DataStore ds, SITTransaction transaction) throws SITException {
    //	return cercaFiltro(ds, transaction, null, null, null);
    //}
    
    /**
     * Sulla base dei parametri passati come argomento applica il filtro 
     * SIT del layer per ottenere le features risultanti.
     *
     * @param ds - Datqastore
     * @param transaction - Transazione
     * @param maxFeatures - se definito e maggiore di zero indica il numero massimo di record ritornati (dimesioni pagina in caso di paginazione)
     * @param startIndex - se definito e maggiore di zero indica da quale record iniziare (utile in caso di paginazione)
     * @param sortFields - se definito e contenente almeno un elemento indica i campi di ordinamento con le relative direzioni
     * @return
     * @throws SITException
     */
    public SITPaginatedResult cercaFiltro(SITTransaction transaction, Integer maxFeatures, Integer startIndex, SortItem[] sortFields ) throws SITException {
//ArrayList<? extends OggettoTerritorio> 
    	SITPaginatedResult retVal = new SITPaginatedResult();
    	retVal.setMaxFeatures(maxFeatures);
    	retVal.setStartIndex(startIndex);
    	retVal.setSortItems(sortFields);
    	
        ArrayList<OggettoTerritorio> retpol = new ArrayList<OggettoTerritorio>();
        boolean isNewTransaction = false;
        SITTransaction tmpTransaction = null;

        try {
        	 DataStore store = getDataStore();

            if (transaction == null) {
                tmpTransaction = new SITDefaultTransaction();
                isNewTransaction = true;
            } else {
                tmpTransaction = transaction;
            }

            if(store == null){
                store = getDataStore();
            }

            //, new String[]{"nprov", "prov_istat" }
            Query query = this.buildQuery(maxFeatures, startIndex, sortFields);
            
            FeatureReader<?, SimpleFeature> features = (FeatureReader<?, SimpleFeature>)store.getFeatureReader(query,tmpTransaction); //tmpTransaction                
            
            try {
                while( features.hasNext() ){
                    SimpleFeature curFeat = features.next();                        
                    retpol.add(creaOggetto(curFeat));
                }
            }catch(Exception e){
                logger.error("Errore durante la lettura delle features",e);
            }finally {
                features.close();
            }

            logger.debug("Ho letto " + retpol.size() + " features...");                       

            if (maxFeatures!=null && maxFeatures > 0) {
	            retVal.setTotalCount(getCountFiltro());
            } else {
            	retVal.setTotalCount(retpol.size());
            }
        } catch (Exception e) {  
            if(isNewTransaction && tmpTransaction != null){
                try{
                    tmpTransaction.rollback();
                    //logger.error("Rollback");
                }catch(IOException ioe){
                    logger.error("Errore durante rollback della transazione",ioe);                    
                }
            }

            String errMsg = "Errore durante la ricerca del filtro"; 
            logger.error(errMsg,e);
            throw new SITException(errMsg,e);

        } finally {
            if(isNewTransaction && tmpTransaction != null){
                try{                    
                    tmpTransaction.commit();
                    tmpTransaction.close();
                }catch(IOException ioe){
                    logger.error("Errore durante il commit della transazione",ioe);
                }
            }
        }   

        filtroTotale.ResetFiltro();  
        retVal.setResult(retpol);
        return retVal;            
    }
    
    /**
     * @param filterString
     * @param ogcFilterVersion
     * @return Filter
     * @throws SITException
     */
    private Filter parseFilter(String filterString, String ogcFilterVersion) throws SITException{
    	Filter filter = null;
    	
    	try{
    		filter = CQL.toFilter(filterString);
    	}catch(CQLException e){
    		logger.warn("Errore durante in parsing the filtro CQL ", e);
    		
    		logger.info("Tentativo di parsing filtro XML OGC...");
    		
    		InputStream inputStream = new ByteArrayInputStream(filterString.getBytes());
    		
    		//
    		// Check the OGC filter version
    		//
    		Configuration configuration = new org.geotools.filter.v1_0.OGCConfiguration();
    		if(ogcFilterVersion.equalsIgnoreCase("1.0.0")){
    			// Parse using v1.0.0
    			configuration = new org.geotools.filter.v1_0.OGCConfiguration();
    		}else if(ogcFilterVersion.equalsIgnoreCase("1.1.0")){
    			// Parse using v1.1.0
    			configuration = new org.geotools.filter.v1_1.OGCConfiguration();
    		}else{
    			// Parse using v2.0
    			configuration = new org.geotools.filter.v2_0.FESConfiguration();
    		}
    		
        	Parser parser = new Parser(configuration);
        	
        	try {
    			filter = (Filter) parser.parse(inputStream);
    		} catch (IOException exc) {
    			logger.error("Errore durante in parsing the filtro OGC ", exc);
    			throw new SITException(exc.getMessage(), exc);
    		} catch (SAXException exc) {
    			logger.error("Errore durante in parsing the filtro OGC ", exc);
    			throw new SITException(e.getMessage(), exc);
    		} catch (ParserConfigurationException exc) {
    			logger.error("Errore durante in parsing the filtro OGC ", exc);
    			throw new SITException(exc.getMessage(), exc);
    		}
    	}
    	
    	return filter;
    }
    
    /**
     * @param ogcFilterVersion 
     * @param inputStream
     * @param maxFeatures
     * @param startIndex
     * @param sortFields
     * @return ITPaginatedResult
     * @throws SITException
     */
    public SITPaginatedResult searchByFilter(String filterString, String ogcFilterVersion, 
    		Integer maxFeatures, Integer startIndex, SortItem[] sortFields) throws SITException{
    	Filter filter = parseFilter(filterString, ogcFilterVersion);
    	
    	if(filtroTotale == null) {
            filtroTotale = this.getFiltroVuoto();
        }

        filtroTotale.AndFiltroPriv(filter); 
        SITPaginatedResult result = cercaFiltro(null, maxFeatures, startIndex, sortFields); 
        
        filtroTotale.ResetFiltro(); 
    	return result;
    }
    
    /**
     * @param filterString
     * @param ogcFilterVersion
     * @param maxFeatures
     * @param startIndex
     * @param sortFields
     * @param tempdirpath 
     * @return File
     * @throws SITException
     */
    public File exportData(String filterString, String ogcFilterVersion, 
    		Integer maxFeatures, Integer startIndex, SortItem[] sortFields, 
    		String tempdirpath, String format) throws SITException{
    	
    	if(filterString != null){
        	Filter filter = parseFilter(filterString, ogcFilterVersion);
        	
        	if(filtroTotale == null) {
                filtroTotale = this.getFiltroVuoto();
            }

        	filtroTotale.AndFiltroPriv(filter);
    	}
    	
        File file = null;        
        try {
        	DataStore store = getDataStore();
            
        	if(store == null){
                store = getDataStore();
            }
            
            // //////////////////////////////////////////////////
            // Build the Query accordingly the given filter
            // //////////////////////////////////////////////////
            Query query = this.buildQuery(maxFeatures, startIndex, sortFields);
            
            // //////////////////////////////////////////////////
            // Esporta i dati secondo il formato richiesto
            // //////////////////////////////////////////////////
            if(format.equals("shp")){            	
            	file = this.shpExport(store, query, tempdirpath);
            }else if(format.equals("csv")){
            	file = this.csvExport(store, query, tempdirpath);
            }else if(format.equals("spatialite")){
            	file = this.spatialiteExport(store, query, tempdirpath);
            }else{
            	throw new Exception("Il formato di export: " + format + " non è conosciuto o non supportato");
            }
            
        } catch (Exception e) {  
            String errMsg = "Errore durante la ricerca del filtro"; 
            logger.error(errMsg,e);
            throw new SITException(errMsg,e);
        } 

        filtroTotale.ResetFiltro();  
        return file;
    }

    /**
     * @param store
     * @param query
     * @param tempdirpath
     * @return File
     * @throws SITException
     */
    public File shpExport(DataStore store, Query query, String tempdirpath) throws SITException{
    	
        SITTransaction transaction = null;
        File shpZip = null;
        
        try {
            SimpleFeatureSource featureSource = store.getFeatureSource(this.getTypeName());
            SimpleFeatureType ft = featureSource.getSchema();
            
            String fileName = ft.getTypeName();
            
            File file = new File(tempdirpath, fileName + ".shp");
            
            //
            // Preparazione dello store di export
            //
            Map<String, java.io.Serializable> creationParams = new HashMap<String, java.io.Serializable>();
            creationParams.put("url", DataUtilities.fileToURL(file));
            
            FileDataStoreFactorySpi factory = FileDataStoreFinder.getDataStoreFactory("shp");
            DataStore dataStore = factory.createNewDataStore(creationParams);
            
            dataStore.createSchema(ft);
            
            //
            // Interrogazione sulla base della query passata
            //
            ArrayList<OggettoTerritorio> retpol = new ArrayList<OggettoTerritorio>();
            transaction = new SITDefaultTransaction();
            FeatureReader<?, SimpleFeature> features = (FeatureReader<?, SimpleFeature>)store.getFeatureReader(query, transaction);                
            
            try {
                while(features.hasNext()){
                    SimpleFeature curFeat = features.next();                        
                    retpol.add(creaOggetto(curFeat));
                }
            }catch(Exception e){
                logger.error("Errore durante la lettura delle features",e);
            }finally {
                features.close();
            }
            
            //
            // Preparazione dello zip di output
            //
            shpZip = new File(tempdirpath, fileName + ".zip");
            this.CopiaSuSHPZip(shpZip, file.getName(), retpol);
                
        } catch (Exception e) {  
            if(transaction != null){
                try{
                	transaction.rollback();
                    logger.error("Rollback");
                }catch(IOException ioe){
                    logger.error("Errore durante rollback della transazione",ioe);                    
                }
            }

            String errMsg = "Errore durante la ricerca del filtro"; 
            logger.error(errMsg,e);
            throw new SITException(errMsg,e);

        } finally {
            if(transaction != null){
                try{                    
                	transaction.commit();
                	transaction.close();
                }catch(IOException ioe){
                    logger.error("Errore durante il commit della transazione",ioe);
                }
            }
        }   

        filtroTotale.ResetFiltro();  
        return shpZip;
    }
    
    /**
     * @param store
     * @param query
     * @param tempdirpath
     * @return File
     * @throws SITException
     */
    public File spatialiteExport(DataStore store, Query query, String tempdirpath) throws SITException{
    	
        SITTransaction transaction = null;
        
        File spatialite = null;
        try {
            SimpleFeatureSource featureSource = store.getFeatureSource(this.getTypeName());
            SimpleFeatureType ft = featureSource.getSchema();
            
            String fileName = ft.getTypeName();
            
            spatialite = new File(tempdirpath, fileName + ".db");
            
//            System.setProperty("java.library.path", "C:/spatialite_libs");
            System.setProperty("org.sqlite.lib.path", "C:/spatialite_libs");
            System.setProperty("org.sqlite.lib.name", "sqlitejdbc.dll");
            
            //
            // Preparazione dello store di export
            //
            SpatiaLiteDataStoreFactory dsFactory = new SpatiaLiteDataStoreFactory();
            
            if (!dsFactory.isAvailable()) {
              throw new SITException("SpatiaLite support not avaialable, ensure all required " + "native libraries are installed");
            }
            
            Map dbParams = new HashMap();
//            dbParams.put(SpatiaLiteDataStoreFactory.DBTYPE.key, "spatialite");
//            dbParams.put(SpatiaLiteDataStoreFactory.DATABASE.key, spatialite.getAbsolutePath());
            
            dbParams.put(JDBCDataStoreFactory.DBTYPE.key, "spatialite");
            dbParams.put(JDBCDataStoreFactory.DATABASE.key, spatialite.getAbsolutePath());
            
            DataStore dataStore = dsFactory.createDataStore(dbParams);
//            DataStore dataStore = DataStoreFinder.getDataStore(dbParams);
            dataStore.createSchema(ft);
            
            //
            // Interrogazione sulla base della query passata
            //
            ArrayList<OggettoTerritorio> retpol = new ArrayList<OggettoTerritorio>();
            transaction = new SITDefaultTransaction();
            FeatureReader<?, SimpleFeature> features = (FeatureReader<?, SimpleFeature>)store.getFeatureReader(query, transaction);                
            
            try {
                while(features.hasNext()){
                    SimpleFeature curFeat = features.next();                        
                    retpol.add(creaOggetto(curFeat));
                }
            }catch(Exception e){
                logger.error("Errore durante la lettura delle features",e);
            }finally {
                features.close();
            }
            
            //
            // Popolamento dello store di export
            //
            this.CopiaSuDs(dataStore, retpol);
                
        } catch (Exception e) {  
            if(transaction != null){
                try{
                	transaction.rollback();
                    logger.error("Rollback");
                }catch(IOException ioe){
                    logger.error("Errore durante rollback della transazione",ioe);                    
                }
            }

            String errMsg = "Errore durante la ricerca del filtro"; 
            logger.error(errMsg,e);
            throw new SITException(errMsg,e);

        } finally {
            if(transaction != null){
                try{                    
                	transaction.commit();
                	transaction.close();
                }catch(IOException ioe){
                    logger.error("Errore durante il commit della transazione",ioe);
                }
            }
        }   

        filtroTotale.ResetFiltro();  
        return spatialite;
	}
    
    /**
     * @param store
     * @param query
     * @param tempdirpath
     * @return File
     * @throws SITException
     */
    public File csvExport(DataStore store, Query query, String tempdirpath) throws SITException{
    	
        File csvFile = null;        
        try {
            SimpleFeatureSource featureSource = store.getFeatureSource(this.getTypeName());
            SimpleFeatureType ft = featureSource.getSchema();
            
            String fileName = ft.getTypeName();
            
            csvFile = new File(tempdirpath, fileName + ".csv");
            
            // //////////////////////////////////////////////////
            // Creazione del writer da usare per il CSV finale
            // //////////////////////////////////////////////////
            BufferedWriter w = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(csvFile, false)));
            
            SimpleFeatureCollection collection = featureSource.getFeatures(query);

            if (collection.getSchema() instanceof SimpleFeatureType) {
                // Scrittura dell'intestazione
                SimpleFeatureType featureType = (SimpleFeatureType) collection.getSchema();
                w.write("FID,");
                for ( int i = 0; i < ft.getAttributeCount(); i++ ) {
                    AttributeDescriptor ad = featureType.getDescriptor( i );
                    w.write( prepCSVField(ad.getLocalName()) );
                       
                    if ( i < ft.getAttributeCount()-1 ) {
                       w.write( "," );
                    }
                }
            } else {
                // Features complesse
                w.write("gml:id,");

                int i = 0;
                for (PropertyDescriptor att : collection.getSchema().getDescriptors()) {
                    // Escludere attributi temporanei
                    if (!att.getName().getLocalPart().startsWith("FEATURE_LINK")) {
                        if (i > 0) {
                            w.write(",");
                        }
                        String elName = att.getName().toString();
                        Object xsd = att.getUserData().get(XSDElementDeclaration.class);
                        if (xsd != null && xsd instanceof XSDElementDeclarationImpl) {
                            // ////////////////////////////////////////////////////////////////////////
                        	// Ottenere il nome del prefisso, se possibile, altrimenti il default 
                        	// è il nome completo dello spazio dei nomi con URI
                        	// ////////////////////////////////////////////////////////////////////////
                            XSDElementDeclarationImpl xsdEl = (XSDElementDeclarationImpl) xsd;
                            elName = xsdEl.getQName();
                        }
                        
                        w.write(prepCSVField(elName));
                        i++;
                    }
                }
            }
            
            w.write( "\r\n" );
            
            //
            // Preparare il formatter per i campi numerici
            //
            NumberFormat coordFormatter = NumberFormat.getInstance(Locale.US);
            coordFormatter.setMaximumFractionDigits(3);
            coordFormatter.setGroupingUsed(false);
               
            //
            // Scrivere le features per compilare il file CSV finale
            // 
            FeatureIterator<?> i = collection.features();
            try {
                while( i.hasNext() ) {                
                    Feature f = i.next();
                    // Recupero del fid
                    w.write(prepCSVField(f.getIdentifier().getID()));
                    w.write(",");
                    if (f instanceof SimpleFeature) {
                        // Resupero degli attributi
                        for ( int j = 0; j < ((SimpleFeature) f).getAttributeCount(); j++ ) {
                            Object att = ((SimpleFeature) f).getAttribute( j );
                            if ( att != null ) {
                                String value = formatToString(att, coordFormatter);
                                w.write( prepCSVField(value) );
                            }
                            if ( j < ((SimpleFeature) f).getAttributeCount()-1 ) {
                                w.write(",");    
                            }
                        }
                    } else {
                        // Features complesse
                        Iterator<PropertyDescriptor> descriptors = collection.getSchema().getDescriptors().iterator();
                        
                        // Resupero degli attributi
                        int j = 0;
                        while (descriptors.hasNext()) {
                            PropertyDescriptor desc = descriptors.next();
                            
                            if (desc.getName().getLocalPart().startsWith("FEATURE_LINK")) {
                                // Saltare attributi temporanei
                                continue;
                            }
                            if (j > 0) {
                                w.write(",");
                            }
                            j++;
                            
                            // Proprietà multivalore non sono supportate, solamente per SF0 per adesso
                            Collection<Property> values = f.getProperties(desc.getName());
                            if (values.size() > 1) {
                                throw new UnsupportedOperationException(
                                        "Proprietà multivalore non sono supportate per il formato CSV!");
                            }

                            Object att = null;
                            if (!values.isEmpty()) {
                                att = values.iterator().next().getValue();
                            }

                            if (att != null) {
                                String value = formatToString(att, coordFormatter);
                                w.write(prepCSVField(value));
                            }     
                        }
                    }

                    w.write("\r\n");
                }
                
            } finally {
                i.close();
            }
               
            w.flush();
            
        } catch (Exception e) {  
            String errMsg = "Errore durante la ricerca del filtro"; 
            logger.error(errMsg,e);
            throw new SITException(errMsg,e);
        } 

        filtroTotale.ResetFiltro();  
        return csvFile;
	}
    
    /**
     * @param field
     * @return String
     */
    private String prepCSVField(String field){
    	// I caratteri tra virgolette devono essere rappresentati da una coppia di doppie virgolette 
    	String mod = field.replaceAll("\"", "\"\"");
    	
    	// Racchiudere la stringa tra doppi apici se contiene doppi apici, virgole o ritorni a capo
    	Pattern csv_escapes = Pattern.compile("[\"\n,\r]");
        if (csv_escapes.matcher(mod).find()) {
            mod = "\"" + mod + "\"";
    	}
    	
		return mod;
    }
    
    /**
     * @param att
     * @param coordFormatter
     * @return String
     */
    private String formatToString(Object att, NumberFormat coordFormatter) {
        String value = null;
        
        if (att instanceof Number) {
            // Don't allow scientific notation in the output, as OpenOffice won't
            // recognize that as a number
            value = coordFormatter.format(att);
        } else if (att instanceof Date) {
            // Serialize dates in ISO format
            if (att instanceof java.sql.Date)
                value = DateUtil.serializeSqlDate((java.sql.Date) att);
            else if (att instanceof java.sql.Time)
                value = DateUtil.serializeSqlTime((java.sql.Time) att);
            else
                value = DateUtil.serializeDateTime((Date) att);
        } else {
            // Everything else we just "toString"
            value = att.toString();
        }
        
        return value;
    }
    
    /**
     * @param maxFeatures
     * @param startIndex
     * @param sortFields
     * @return Query
     */
    private Query buildQuery(Integer maxFeatures, Integer startIndex, SortItem[] sortFields){
        Query query = new Query(configBean.getTypeName(), filtroTotale.getFiltro());  
        
        // Paginazione
        if (maxFeatures!=null && maxFeatures > 0) {
            query.setMaxFeatures(maxFeatures);
            if (startIndex!=null && startIndex>0) query.setStartIndex(startIndex);
        } 
        
        // Ordinamento
        if (sortFields!=null && sortFields.length>0) {
            SortBy[] sortBy = new SortBy[sortFields.length];
            int i=0;
            for (SortItem si: sortFields) {
            	SortOrder so = (si.getOrdine()==Dir.CRESCENTE) ? SortOrder.ASCENDING : SortOrder.DESCENDING;
            	SortBy sort = SITFilterFactory.filterFactory.sort(getNomiCampi( si.getNomeLogico()), so);
            	sortBy[i]= sort;
            	i++;
            }
            query.setSortBy(sortBy);
        }
        
        if(filtroTotale.getFiltro() != null){
            logger.debug("Filtro: " + filtroTotale.getFiltro().toString());
        }
        
        return query;
    }
    
    /**
     * Restituisce un oggetto vuoto del tipo contenuto nel layer corrente.<br> 
     * Per esempio per {@link LayerCircoscrizioni} restituisce un {@link PoligonoCircoscrizione}.
     * <br>
     * <br>
     * <b>Esempio</b><br>
     * LayerCircoscrizioni circ = ComunePO.getCircoscrizioni();<br> 
     * PoligonoCircoscrizione polcirc = (PoligonoCircoscrizione) circ.creaOggettoTerritorio();
     * <br>
     * @return il nuovo oggetto creato
     * @throws IOException
     * @throws SITException 
     */
    public OggettoTerritorio creaNuovoOggettoTerritorio() 
    throws IOException, SITException {

        OggettoTerritorio ogTer = null;
        DataStore ds = null;

        try {
////        TOB           
////        ogTer = creaOggetto(getDataStore().getSchema(configBean.getTypeName()).create(null));

//          SimpleFeatureType sft = getDataStore().getSchema(configBean.getTypeName());   	

////        TOB    	   
////        FeatureIdImpl defaultFeatureId = SimpleFeatureBuilder.createDefaultFeatureIdentifier("DIA.269");
////        String id = defaultFeatureId.getID();
////        SimpleFeature feature = SimpleFeatureBuilder.build(sft, new ArrayList<Object>(), defaultFeatureId);

//          SimpleFeature feature = DataUtilities.template(sft);

//          ogTer = creaOggetto(feature);

            ds = getDataStore();

            SimpleFeatureBuilder b = new SimpleFeatureBuilder(ds.getSchema(configBean.getTypeName()));
            SimpleFeature feature = b.buildFeature(null);

            ogTer = creaOggetto(feature);

        } catch (IllegalAttributeException e) {

            // ///////////////////////////////////////////////////
            // L'eccezione non dovrebbe mai verificarsi 
            // perchè è passato null come argomento...
            // ///////////////////////////////////////////////////

        } catch (IOException e) {
            logger.error("IOxception durante creazione nuovo oggeto territorio",e);
            throw e;
        } catch (SITException e) {
            logger.error("SITException durante creazione nuovo oggeto territorio",e);
            throw e;
        }

        return ogTer; 
    }

    /**
     * Ricerca i poligoni del layer corrente che contengono completamente il punto in input.
     * 
     * @param x Coordinata X del punto
     * @param y Coordinata Y del punto
     * @return Ritorna i poligoni che contengono il punto in input. 
     * @throws IOException 
     * @throws SITException 
     */
    public ArrayList chiContiene(double x, double y) throws IOException, SITException {

        Point punto = LayerPuntiTerritorio.creaPoint(x,y);

        

        Contains containsFilter = null;

        containsFilter = SITFilterFactory.contains(getGeometryFieldName(), punto);

        return FiltroGeografico(containsFilter);				
    }

    /**
     * Ricerca i poligoni del layer corrente che contengono completamente il punto in input ed 
     * un buffer di raggio "range" intorno al punto stesso.
     * 
     * @param x Coordinata X del punto
     * @param y Coordinata Y del punto
     * @param range Come descritto sopra
     * @return Ritorna i poligoni che contengono il punto in input. 
     * @throws IOException 
     * @throws SITException 
     */
    public ArrayList chiContiene(double x, double y, double range) throws 
    IOException, SITException{

        Point punto = LayerPuntiTerritorio.creaPoint(x,y);

        Contains containsFilter = null;

        containsFilter = SITFilterFactory.contains(getGeometryFieldName(), punto.buffer(range));

        return FiltroGeografico(containsFilter);

//      TOB		
//      Point punto = LayerPuntiTerritorio.creaPoint(x,y);

//      return FiltroGeografico((Geometry) punto.buffer(range), GeometryFilter.GEOMETRY_CONTAINS);

    }

    /**
     * Ricerca i poligoni del layer corrente che contengono completamente l'OggettoTerritorio in input (pol).
     * 
     * @param pol OggettoTerritorio che deve essere contenuto 
     * @return Ritorna i poligoni che contengono l'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException      
     */    
    public ArrayList chiContiene (OggettoTerritorio pol) throws IOException, SITException {

        Geometry geometry = (Geometry)pol.getFeat().getDefaultGeometry();

        Contains containsFilter = null;

        containsFilter = SITFilterFactory.contains(getGeometryFieldName(), geometry);

        return FiltroGeografico(containsFilter);	

//      TOB		
//      return FiltroGeografico((Geometry) pol.getFeat().getDefaultGeometry(), GeometryFilter.GEOMETRY_CONTAINS);
    }

    /**
     * Ricerca i poligoni del layer che contengono l'OggettoTerritorio in input (pol).</br>
     * Se il contorno dell'oggetto passato come parametro sta sul contorno dell'oggetto questo
     * è considerato essere contenuto, diversamente dal metodo chiContiene.
     * 
     * @param pol
     * @return List OggettiTerritorio del layer corrente che coprono l'OggettoTerritorio passato come parametro
     * @throws IOException
     * @throws SITException
     */
    public List chiCopre (OggettoTerritorio pol) 
    throws IOException, SITException {

//      TOB    	
//      // IMPORTANTE
//      // In attesa che i Geotools implementino il metodo cover, questo viene risolto cercando i poligoni del layer corrente che intersecano
//      // l'oggetto passato come parametro e poi andando a verificare che questi coprano l'oggeto mediante, usando il metodo messo a disposizione
//      // dal JTS
//      ArrayList<OggettoTerritorio> coprenti = new ArrayList<OggettoTerritorio>();

//      Geometry polGeom = (Geometry) pol.getFeat().getDefaultGeometry();
//      List<OggettoTerritorio> intersecanti = FiltroGeografico( polGeom , GeometryFilter.GEOMETRY_INTERSECTS);
//      for(OggettoTerritorio intersecante: intersecanti){
//      if(intersecante.copre(pol)){
//      coprenti.add(intersecante);
//      }
//      }

//      return coprenti;

        ArrayList<OggettoTerritorio> coprenti = new ArrayList<OggettoTerritorio>();        
        Geometry polGeom = (Geometry) pol.getFeat().getDefaultGeometry();

        Intersects intersectsFilter = null;

        intersectsFilter = SITFilterFactory.intersects(getGeometryFieldName(), polGeom);

        List<OggettoTerritorio> intersecanti = FiltroGeografico(intersectsFilter);
        for(OggettoTerritorio intersecante : intersecanti){
            if(intersecante.copre(pol)){
                coprenti.add(intersecante);
            }
        }

        return coprenti;
    }

    /**
     * Ricerca i poligoni del layer corrente che contengono completamente il poligono risultante 
     * dall'unione dell'oggettoterritorio in input (pol) e di un buffer di raggio "range.
     * 
     * @param pol OggettoTerritorio che deve essere contenuto
     * @param range Come descritto sopra 
     * @return Ritorna i poligoni che contengono l'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException 
     * 
     */
    public ArrayList chiContiene (OggettoTerritorio pol, double range) 
    throws IOException, SITException {

        Geometry geometry = ((Geometry) pol.getFeat().getDefaultGeometry()).buffer(range);

        Contains containsFilter = null;

        containsFilter = SITFilterFactory.contains(pol.getFeat().
                getDefaultGeometryProperty().getName().getLocalPart(), geometry);

        return FiltroGeografico(containsFilter);

//      TOB		
//      return FiltroGeografico((Geometry) pol.getFeat().getDefaultGeometry().buffer(range), GeometryFilter.GEOMETRY_CONTAINS);        
    }

    /**
     * Verifica se l'oggetto passato come argomento è contenuto da altre features del layer.
     * 
     * @param pol
     * @return boolean
     * @throws IOException
     * @throws SITException
     */
    public boolean contiene (OggettoTerritorio pol) throws IOException, SITException {

        ArrayList<OggettoTerritorio> buf = chiContiene(pol);

        if (buf.size()>0) {
            return true;
        } else {
            return false;
        }       
    }

    /**
     * Restituisce la FeatureType del layer.
     * 
     * @return SimpleFeatureType
     * @throws SITException
     */
    protected SimpleFeatureType getFeatureType() throws SITException {

        SimpleFeatureType featuretype = null;
//      TOB
//      FeatureSource<SimpleFeatureType, SimpleFeature> features = null; 

        DataStore store = null;

        try {
            store = getDataStore();
            //features = store.getFeatureSource(configBean.getTypeName());

//          TOB            
//          featuretype = store.getFeatureSource(configBean.getTypeName()).getSchema();
            featuretype = store.getSchema(configBean.getTypeName());

            //featuretype = features.getFeatures().getSchema();
        } catch (IOException e) {
            String errMsg = "IOException durante il recupero della FeatureType per " + configBean.getTypeName();
            logger.error(errMsg, e);
            throw new SITException(errMsg, e);
        } catch (SITException e) {
            String errMsg = "SITException durante il recupero della FeatureType per " + configBean.getTypeName();
            logger.error(errMsg, e);
            throw e;
        }

        return featuretype;
    }

    /**
     * Restituisce il sistema di riferimento del layer.
     * 
     * @return CoordinateReferenceSystem
     * @throws SITException
     */
    protected CoordinateReferenceSystem getCRS() throws SITException {
    	
    	CoordinateReferenceSystem crs = null;
    	
    	// Cerco il sistema di riferimento nel file di config se non predente interrogo il database altrimenti lo imposto manualmente

    	try {
    		
	    	if (StringUtils.isNotEmpty(configBean.getSRID())) {
	    		logger.debug("Recupero il CRS del layer " + Nome + " come definito nel file di Config: " + configBean.getSRID());
	        	crs = CRS.decode(configBean.getSRID());
	    	} else {
//				TOB
//				CoordinateReferenceSystem crs = getFeatureType().getDefaultGeometry().getCoordinateSystem();
	    		logger.debug("Recupero il CRS del layer " + Nome + " dal database tramite geotools...");
	        	crs = getFeatureType().getCoordinateReferenceSystem();
	    	}
	        
	        if(crs == null) {
	        	logger.warn("Impossibile recuperare il CRS per il layer " + Nome + " poiche' non e' stato impostato l'SRID nel file di config e non e' stato possibile recuperarlo tramite GeoTools. Imposto EPSG:3003");
	        	crs = CRS.decode("EPSG:3003");
	        }
	        
        } catch (NoSuchAuthorityCodeException e) {
            throw new SITException("NoSuchAuthorityCodeException durante decodifica CRS", e);
        } catch (FactoryException e) {
            throw new SITException("FactoryException durante decodifica CRS", e);
        }

        return crs;        
    }

    /**
     * Ricerca i poligoni del layer corrente che interscano (anche parzialmente) il punto in input, che è passato espresso secondo il sistema di coordinate 
     * identificato dal parametro epsgSRID.
     * 
     * @param x Coordinata X del punto
     * @param y Coordinata Y del punto
     * @param sourceSRID stringa identificativa del sistema di riferimento. Per es. epsg:4326
     * @return Ritorna i poligoni che intersecano il punto in input. 
     * @throws IOException 
     * @throws SITException 
     * 
     */
    public ArrayList chiInterseca (double x, double y, String sourceSRID) throws IOException, SITException {
        CoordinateReferenceSystem targetCRS = getCRS(); 
        Point punto = LayerPuntiTerritorio.creaPoint(x, y, sourceSRID, targetCRS);        
        return chiInterseca(punto);
    }

    /**
     * Ricerca i poligoni del layer corrente che interscano (anche parzialmente) il punto in input.
     * 
     * @param x Coordinata X del punto
     * @param y Coordinata Y del punto
     * @return Ritorna i poligoni che intersecano il punto in input. 
     * @throws IOException 
     * @throws SITException 
     * 
     */
    public ArrayList chiInterseca (double x, double y) throws IOException, SITException { 
        Point punto = LayerPuntiTerritorio.creaPoint(x,y);        
        return chiInterseca(punto);  
    }

    /**
     * Ricerca i poligoni del layer corrente che intersecano (anche parzialmente) il punto in input ed 
     * un buffer di raggio "range" intorno al punto stesso.
     * 
     * @param x Coordinata X del punto
     * @param y Coordinata Y del punto
     * @param range Come descritto sopra
     * @param sourceSRID stringa identificativa del sistema di riferimento. Per es. epsg:4326
     * @return Ritorna i poligoni che intersecano. 
     * @throws IOException 
     * @throws SITException 
     * 
     */    
    public ArrayList chiInterseca (double x, double y, double range, String sourceSRID) throws IOException, SITException {
        CoordinateReferenceSystem targetCRS = getCRS();    
        Point punto = LayerPuntiTerritorio.creaPoint(x, y, sourceSRID, targetCRS);
        return chiInterseca(punto.buffer(range));       
    }

    /**
     * Ricerca i poligoni del layer corrente che intersecano (anche parzialmente) il punto in input ed 
     * un buffer di raggio "range" intorno al punto stesso.
     * 
     * @param x Coordinata X del punto
     * @param y Coordinata Y del punto
     * @param range Come descritto sopra
     * @return Ritorna i poligoni che intersecano. 
     * @throws IOException 
     * @throws SITException 
     * 
     */    
    public ArrayList chiInterseca (double x, double y, double range) throws IOException, SITException {
        Point punto = LayerPuntiTerritorio.creaPoint(x,y);
        return chiInterseca(punto.buffer(range));
    }

    /**
     * Ricerca i poligoni del layer corrente che intersecano (anche parzialmente) rettangolo che ha come
     * centro il punto indicato, come base il doppio del bufferX e come altezza il doppio del bufferY.
     * 
     * @param x Coordinata X del punto
     * @param y Coordinata Y del punto
     * @param bufferX range in direzione X
     * @param bufferY range in direzione Y
     * @return ArrayList
     * @throws IOException
     * @throws SITException
     */
    public ArrayList chiInterseca (double x, double y, double bufferX, double bufferY) throws IOException, SITException {

        Coordinate[] coords = new Coordinate[5];

        coords[0] = new Coordinate(x-bufferX,y-bufferY);
        coords[1] = new Coordinate(x-bufferX,y+bufferY);
        coords[2] = new Coordinate(x+bufferX,y+bufferY);
        coords[3] = new Coordinate(x+bufferX,y-bufferY);
        coords[4] = new Coordinate(x-bufferX,y-bufferY);

        GeometryFactory geometryFactory = new GeometryFactory();
        LinearRing rect = geometryFactory.createLinearRing(coords);

        Polygon poly = geometryFactory.createPolygon(rect, null);
        return chiInterseca(poly);
    }

    /**
     * Ricerca i poligoni del layer corrente che intersecano (anche parzialmente) l'oggettoterritorio in input (pol).
     * 
     * @param pol OggettoTerritorio che deve essere contenuto 
     * @return Ritorna i poligoni che intersecano l'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException 
     * 
     */    
    public ArrayList chiInterseca(OggettoTerritorio pol) throws IOException, SITException {
        Geometry geometry = getGeometryFromOggettoTerritorio(pol);	
        return chiInterseca(geometry);  
    }
    
    /**
     * Ricerca gli oggetti del layer corrente che intersecano (anche parzialmente) La gerometria passata.
     * @param geometry
     * @return
     * @throws IOException
     * @throws SITException
     */
    private ArrayList chiInterseca(Geometry geometry) throws IOException, SITException {
    	Intersects intersectsFilter = null;	  
        intersectsFilter = SITFilterFactory.intersects(getGeometryFieldName(), geometry);	  
        return FiltroGeografico(intersectsFilter);  

    }

    /**
     * Verifica se altre features intersecano l'oggetto passato come argomento.
     * 
     * @param pol
     * @return boolean
     * @throws IOException
     * @throws SITException
     */
    public boolean interseca(OggettoTerritorio pol) throws IOException, SITException {

        ArrayList<OggettoTerritorio> buf = chiInterseca(pol);

        if (buf.size()>0) {
            return true;
        } else {
            return false;
        } 
    }

    /**
     * Ricerca i poligoni del layer corrente che intersecano (anche parzialmente) il poligono risultante 
     * dall'unione dell'oggettoterritorio in input (pol) e di un buffer di raggio "range".
     * 
     * @param pol OggettoTerritorio che deve essere contenuto
     * @param range Come descritto sopra 
     * @return Ritorna i poligoni che intersecano l'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException  
     */
    public ArrayList chiInterseca (OggettoTerritorio pol, double range) throws IOException, SITException {
    	
    	Geometry geometry = getGeometryFromOggettoTerritorio(pol).buffer(range);
        return chiInterseca(geometry);
    }

    /**
     * Ricerca i poligoni del layer corrente che toccano (hanno almeno un tratto di confine in comune)
     * con l'oggettoterritorio in input (pol).
     * 
     * @param pol OggettoTerritorio che deve essere contenuto 
     * @return Ritorna i poligoni che toccano l'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException 
     */    
    public ArrayList chiTocca (OggettoTerritorio pol) throws IOException, SITException {

        Geometry geometry = (Geometry)pol.getFeat().getDefaultGeometry();

        Touches touchesFilter = null;

        touchesFilter = SITFilterFactory.touches(pol.getFeat().
                getDefaultGeometryProperty().getName().getLocalPart(), geometry);

        return FiltroGeografico(touchesFilter); 

//      TOB    	
//      return FiltroGeografico((Geometry) pol.getFeat().getDefaultGeometry(), GeometryFilter.GEOMETRY_TOUCHES);        
    }

    /**
     * Ricerca i poligoni del layer corrente che toccano (hanno almeno un tratto di confine in comune) con 
     * l'oggetto risultante dall'unione dell'oggettoterritorio in input (pol) e di un buffer di raggio "range". 
     * 
     * @param pol OggettoTerritorio che deve essere contenuto
     * @param range Vedi descrizione sopra 
     * @return Ritorna i poligoni che toccano l'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException 
     */    
    public ArrayList chiTocca (OggettoTerritorio pol, double range) throws IOException, SITException {

        Geometry geometry = ((Geometry)pol.getFeat().getDefaultGeometry()).buffer(range);

        Touches touchesFilter = null;

        touchesFilter = SITFilterFactory.touches(pol.getFeat().
                getDefaultGeometryProperty().getName().getLocalPart(), geometry);

        return FiltroGeografico(touchesFilter); 

//      TOB	  
//      return FiltroGeografico((Geometry) pol.getFeat().getDefaultGeometry().buffer(range), GeometryFilter.GEOMETRY_TOUCHES);       
    }

    /**
     * Verifica se altre feature toccano l'oggetto passato come argomento.
     * 
     * @param pol
     * @return boolean
     * @throws IOException
     * @throws SITException
     */
    public boolean tocca (OggettoTerritorio pol) throws IOException, SITException {

        ArrayList<OggettoTerritorio> buf = chiTocca(pol);

        if (buf.size()>0) {
            return true;
        } else {
            return false;
        }  
    }

    /**
     * Sinonimo di {@link LayerTerritorio#chiInterseca(OggettoTerritorio pol, double range) )}.
     * Ricerca i poligoni del layer corrente che sono nel raggio "range" dall'OggettoTerritorio in input. 
     * 
     * @param pol OggettoTerritorio che deve essere contenuto
     * @param range Come descritto sopra 
     * @return Ritorna i poligoni che sono entro un raggio di "range" dall'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException 
     */    
    public ArrayList chiNelRaggioDi(OggettoTerritorio pol, double range) throws IOException, SITException{
        return chiInterseca(pol,range);        
    }    
    
    private ArrayList chiNelRaggioDi(Geometry geometry, double range) throws IOException, SITException{
        return chiInterseca(geometry.buffer(range));        
    }

    /**
     * Ricerca i poligoni del layer corrente che sono al di fuori di un raggio "range" dall'OggettoTerritorio in input. 
     * 
     * @param pol OggettoTerritorio che deve essere contenuto
     * @param range Come descritto sopra 
     * @return Ritorna i poligoni che sono oltre  un raggio di "range" dall'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException 
     */    
    public ArrayList chiOltreUnRaggioDi (OggettoTerritorio pol, double range) throws IOException, SITException {

        Geometry geometry = (Geometry)pol.getFeat().getDefaultGeometry();

        Beyond beyondFilter = null;

        beyondFilter = SITFilterFactory.beyond(pol.getFeat().
                getDefaultGeometryProperty().getName().getLocalPart(), geometry, range, "m");

        return FiltroGeografico(beyondFilter); 

//      TOB    	
//      return FiltroGeografico((Geometry) pol.getFeat().getDefaultGeometry().buffer(range), GeometryFilter.GEOMETRY_BEYOND);        
    }

    /**
     * Sinonimo di {@link LayerTerritorio#chiTocca(OggettoTerritorio pol)}.
     * Ricerca i poligoni del layer corrente confinanti (che toccano hanno almeno un tratto di confine in comune) con l'oggettoterritorio in input (pol).
     * <br>
     * <br>
     * Per esempio per cercare le circoscrizioni confinanti con la circoscrizione EST..<br>
     * <br><pre>
       LayerCircoscrizioni layerCirc = ComunePO.getCircoscrizioni();
       PoligonoCircoscrizione circEst = layerCirc.cercaCircoscrizione("EST");
       ArrayList confinanti = layerCirc.chiConfina(circEst);
       Iterator iter = confinanti.iterator();
       while (iter.hasNext()) {
           PoligonoCircoscrizione polconf = (PoligonoCircoscrizione) iter.next();
           System.out.println(polconf.getCircoscrizione());
       }</pre>
     * 
     * @param pol OggettoTerritorio che deve essere contenuto 
     * @return Ritorna i poligoni che toccano l'oggettoterritorio in input. 
     * @throws IOException 
     * @throws SITException 
     * 
     */    
    public ArrayList chiConfina(OggettoTerritorio pol) throws IOException, SITException {
        ArrayList<OggettoTerritorio> ret = chiTocca(pol);

        // ////////////////////////////////////////////////
        // Rimozione eventuale presenza di "pol" stesso
        // Non sembra necessario....
        // ////////////////////////////////////////////////

        /*Iterator iter = ret.iterator();

        while (iter.hasNext()) {
            OggettoTerritorio pol1 = (OggettoTerritorio) iter.next();
            if (pol.equals(pol1)) {
                ret.remove(pol1);
            }
        }*/

        return ret;
    }

    /**
     * Restituisce l'elenco dei poligoni del layer corrente più vicini all'OggettoTerritorio
     * in input (pol). I poligoni sono ordinati nell'ArrayList  per distanza crescente e sono
     * presenti anche eventuali poligoni a distanza zero.
     * Il numero dei poligoni restituiti non e' determinabile a priori 
     * 
     * @see {@link LayerTerritorio#chiPiuVicino(OggettoTerritorio pol, ArrayList<Double> distanze)}
     * 
     * @param pol Oggetto per il quale sono rischiesti i poligoni più vicini 
     * @return l'elenco dei poligoni del layer corrente più vicini all'OggettoTerritorio
     * in input
     * @throws IOException 
     * @throws SITException 
     */
    public ArrayList chiPiuVicino(OggettoTerritorio pol) throws IOException, SITException {
        return chiPiuVicino(pol, null);        
    }

    /**
     * Restituisce l'elenco dei poligoni del layer corrente più vicino all'OggettoTerritorio
     * in input e le relative distanze. I poligoni sono ordinati nell'ArrayList  per distanza crescente e sono
     * presenti anche eventuali poligoni a distanza zero.
     * Il numero dei poligoni restituiti non e' determinabile a priori<br> 
     * <br>
     * Per Esempio, per ottenere l'elenco delle circoscrizioni più vicine alla particella Foglio 1 Particella 33 del catasto:<br>
      <br><pre>
     LayerCircoscrizioni layerCirc = ComunePO.getCircoscrizioni();
     LayerCatasto layerCatasto = ComunePO.getCatasto();

     // Ricerca particella 1 - 33
     ArrayList particelle = layerCatasto.cercaParticella("1", "33");

     // Verifica se la particella e' stata trovata e se e' una sola
     // Ci sono infatti alcuni errori nel catasto di prato ed alcune particelle
     // non sono univoche
     if (particelle.size()!=1) {
          System.out.println("Particella non trovata o non unica");
          return false;
     }

     PoligonoCatasto particella = (PoligonoCatasto) particelle.get(0);

     // ricerca circoscrizioni piu' vicine
     ArrayList dist = new ArrayList();
     ArrayList piuVic = layerCirc.chiPiuVicino(particella, dist);
     for (int i=0; i<piuVic.size(); i++) {
         PoligonoCircoscrizione Circoscr = (PoligonoCircoscrizione) piuVic.get(i);
         double distanza = ((Double) dist.get(i)).doubleValue();

         System.out.println(i + " - Circoscrizione " + Circoscr.getCircoscrizione() + " : Distanza: " + distanza);
     }</pre>
     *
     * 
     * @param pol Oggetto per il quale sono rischiesti i poligoni più vicini
     * @param distanze ArrayList che conterrà le distanze relative a quanto restituito come valore di ritorno
     * @return l'elenco dei poligoni del layer corrente più vicini all'OggettoTerritorio
     * @throws IOException 
     * @throws SITException 
     * 
     * @see {@link LayerTerritorio#ordinaDistanze(OggettoTerritorio pol, ArrayList<OggettoTerritorio> polDaOrd, ArrayList<Double> distanze)}
     * @see {@link LayerTerritorio#chiInterseca(OggettoTerritorio pol)}
     * @see {@link LayerTerritorio#chiNelRaggioDi(OggettoTerritorio pol, double range) }
     */
    public ArrayList chiPiuVicino(OggettoTerritorio pol, ArrayList<Double> distanze) throws IOException, SITException {
    	Geometry geometry = getGeometryFromOggettoTerritorio(pol);
        return chiPiuVicino(geometry, distanze);
    }
    
    public ArrayList chiPiuVicino(double x, double y) throws IOException, SITException {  
    	Point punto = LayerPuntiTerritorio.creaPoint(x,y);
        return chiPiuVicino(punto,null);
    }
    
    public ArrayList chiPiuVicino(double x, double y, String sourceSRID) throws IOException, SITException {
    	CoordinateReferenceSystem targetCRS = getCRS();    
        Point punto = LayerPuntiTerritorio.creaPoint(x, y, sourceSRID, targetCRS);
        return chiPiuVicino(punto, null);
    }
    
    private ArrayList chiPiuVicino(Geometry geometry, ArrayList<Double> distanze) throws IOException, SITException {

        ArrayList<OggettoTerritorio> nelRaggio=null;

        //TODO Da rendere dinamico o rendere settabile in qualche modo

        double maxrange = 10000;
        double range = 100;
        double step = 250;

        int nDistanzaZero = chiInterseca(geometry).size();

        boolean bOK = false;

        // /////////////////////////
        // Ricerca raggio ideale
        // /////////////////////////

        while (range < maxrange) {
            nelRaggio = chiNelRaggioDi(geometry, range);
            if (nelRaggio.size() > nDistanzaZero) {
                bOK = true;
                break;
            }
            range += step;
        }

        if (bOK) {

            // //////////////////////////////////
            // Ordinamento e calcolo distanza
            // //////////////////////////////////

            return ordinaDistanze(geometry, nelRaggio, distanze);
        } else {
            return null;
        }        
    }


    /**
     * Restituisce un ArrayList che e' l'ordinamento dell'ArrayList polDaOrd
     * per distanza crescente dall'OggettoTerritorio "pol", e nell'ArrayList "distanze" riporta le relative distanze.
     * 
     * @param pol OggettoTerritorio dal quale valuare le distanze
     * @param polDaOrd Elenco di Oggetti Territorio da ordinare per distanza crescente
     * @param distanze Elenco delle relative distanze
     * @return ArrayList ordinato come specificato in descrizione
     */
    public static ArrayList ordinaDistanze(OggettoTerritorio pol, 
            ArrayList<OggettoTerritorio> polDaOrd,  ArrayList<Double> distanze) { 

    	Geometry geometry = (Geometry)pol.getFeat().getDefaultGeometry();
    	return ordinaDistanze(geometry, polDaOrd, distanze);
    }
    
    
    private static ArrayList ordinaDistanze(Geometry geometry, ArrayList<OggettoTerritorio> polDaOrd,  ArrayList<Double> distanze) { 

        ArrayList<OggettoTerritorio> ret = new ArrayList<OggettoTerritorio>();
        ArrayList<Double> retDist = new ArrayList<Double>();

        Iterator<OggettoTerritorio> iter = polDaOrd.iterator();
        double distanza;

        while (iter.hasNext()) {
            OggettoTerritorio pol1 = (OggettoTerritorio) iter.next();
            distanza = geometry.distance((Geometry)pol1.getFeat().getDefaultGeometry());

            if (ret.size()==0){
                retDist.add(new Double(distanza));
                ret.add(pol1);
            } else {

                // /////////////////////////////////////
                // Cerca la posizione in cui inserire
                // /////////////////////////////////////

                boolean bOk = false;
                for (int i=0; i<ret.size();i++) {
                    double dist = ((Double) retDist.get(i)).doubleValue();
                    if (distanza < dist ) {
                        bOk = true;
                        retDist.add(i, new Double(distanza));
                        ret.add(i,pol1);
                        break;
                    }
                }

                if (!bOk) {
                    retDist.add(new Double(distanza));
                    ret.add(pol1);
                }
            }            
        }

        if (distanze!=null){
            distanze.addAll(retDist);
        }

        return ret;
    }

    /**
     * Rimuove l'oggetto passato come argomento dalla FeatureType.
     * 
     * @param oggettoTer
     * @throws IOException
     * @throws SITException
     * @throws SQLException
     */
    public void removeFeature(OggettoTerritorio oggettoTer) throws IOException, SITException, SQLException {

        SITTransaction transaction = new SITDefaultTransaction();

        try {
            removeFeature(oggettoTer, transaction);
        } catch (IOException e) {
            transaction.rollback();
            logger.warn("Classe: " + this.getClass().getName() + " Metodo: RemoveFeature - IOException - Messaggio "+ e.getMessage());
            throw e;
        } catch (SITFIDMapperException e) {
            transaction.rollback();
            logger.warn("Classe: " + this.getClass().getName() + " Metodo: RemoveFeature - SITFIDMapperException - Messaggio "+ e.getMessage());
            throw e;
        } catch (SITException e) {
            logger.warn("SITException " + e.getMessage());
            throw e;
        } catch (SQLException exc) {
            transaction.rollback();
            logger.warn("Classe: " + this.getClass().getName() + " Metodo: RemoveFeature - SQLException - Messaggio "+ exc.getMessage());
            throw exc;
        }

        transaction.commit();
    }

    /**
     * Restituisce la primary key della FeatureType.
     * 
     * @param oggettoTer
     * @return
     * @throws IOException
     * @throws SITException
     * @throws SQLException
     */
    protected String getFIDScrittura(OggettoTerritorio oggettoTer) throws IOException, SITException, SQLException {

        String szID = null;
        DataStore ds;

        //TODO ALE NON GESTISCE CHIAVI MULTIPLE

        if (configBean.getTypeName().equals(configBean.getTypeNameScrittura())) {
            return oggettoTer.getFeat().getID();
        } else {

            try {
                ds = (DataStore) getDataStore();
            } catch (IOException e) {
                logger.warn("IOException durante recupero Datastore",e);
                throw e;
            } catch (SITException e) {
                logger.warn("SITException durante recupero Datastore",e);
                throw e;
            }

            if (JDBCDataStore.class.isAssignableFrom(ds.getClass())) {        	

                JDBCDataStore jdbcds = (JDBCDataStore) ds;        	           
                JDBCFeatureStore fs = (JDBCFeatureStore) jdbcds.getFeatureSource(configBean.getTypeNameScrittura());  
                if(fs.isExposePrimaryKeyColumns()){
                    PrimaryKey key = fs.getPrimaryKey();
                    szID = key.getTableName();

                    for (int i=0; i < key.getColumns().size(); i++) {
                        szID += "."+(oggettoTer.getAttribute(key.getColumns().get(i).getName()));
                    }      

                    return szID;
                }

            }
            return oggettoTer.getFeat().getID().replace(configBean.getTypeName(), configBean.getTypeNameScrittura());
        }

        /* ALE TOLTO

        try {
            ds = (DataStore) getDataStore();
        } catch (IOException e) {
            logger.warn("Classe " + this.getClass().getName() + "IOException durante la getDatastore" );
            throw e;

        } catch (SITException e) {
            logger.warn("SITException " + e.getMessage());
            throw e;
        }

        // NON FUNZIONA SE fidcolumnsasattributes = false (perchè non trova getattribute

        if (JDBCDataStore.class.isAssignableFrom(ds.getClass())) {
            JDBCDataStore jdbcds = (JDBCDataStore) ds;

//TOB            
//            FIDMapper fm = jdbcds.getFIDMapper(configBean.getTypeNameScrittura());
//            
//            //Object[fm.getColumnCount()] pk;
//            
//            ArrayList<Object> pk = new ArrayList<Object>();
//            
//            for (int i=0; i < fm.getColumnCount(); i++) {
//                pk.add(oggettoTer.getAttribute(fm.getColumnName(i)));
//            }
//            
//            szID = fm.getID(pk.toArray());

            JDBCFeatureStore fs = (JDBCFeatureStore)jdbcds.getFeatureSource(configBean.getTypeNameScrittura());
            PrimaryKey key = fs.getPrimaryKey();

            szID = key.getTableName();

            for (int i=0; i < key.getColumns().size(); i++) {
            	szID += "."+(oggettoTer.getAttribute(key.getColumns().get(i).getName()));
            }                       

        } else {
            logger.warn("Classe " + this.getClass().getName() + "Metodo getFIDScrittura - Il datastore di tipo "+ ds.getClass().getName() + "non estende JDBCDataStore" );
            throw new SITFIDMapperException("Metodo getFIDScrittura - Il datastore di tipo "+ ds.getClass().getName() + "non estende JDBCDataStore");
        }
        return szID;
         */

    }

    /**
     * Cancella la feature associata a oggettoTer.<br>
     * <br>
     * Per esempio, per concellare la circoscrizione NORD:<br> 
     * <br><pre>
     // ricerca della circoscrizione da cancellare
     LayerCircoscrizioni layerCirc = ComunePO.getCircoscrizioni();
     PoligonoCircoscrizione circDaCanc = layerCirc.cercaCircoscrizione("NORD");

     if (circDaCanc== null){
        System.out.println("Errore cercando la circoscrizione da cancellare");
        return false;    
     }

     // cancellazione effettiva
     try {
         layerCirc.removeFeature(circDaCanc);
     } catch (IOException e) {
         System.out.println("Eccezione IOException cancellando la circoscrizione appena inserita");
         return false;
     }</pre>
     * 
     * @param oggettoTer Feature da cancellare
     * @param transaction
     * @throws IOException Errore generico nell'accesso al DBStore
     * @throws SITException 
     * @throws SQLException 
     */
    public void removeFeature(OggettoTerritorio oggettoTer, SITTransaction transaction) throws IOException, SITException, SQLException {

        String ID;

        try {
            ID = getFIDScrittura(oggettoTer);
        } catch (SITFIDMapperException e) {
            logger.warn(this.getClass().getName() + " SITFIDMapperException durante recupero FIDScrittura",e);
            throw e;
        } catch (IOException e) {
            logger.warn(this.getClass().getName() + " IOException durante recupero FIDScrittura",e);
            throw e;
        } catch (SQLException e) {
            logger.warn(this.getClass().getName() + " SQLException durante recupero FIDScrittura",e);
            throw e;
        }

//      TOB        
//      FilterFactory ff = FilterFactory.createFilterFactory();        
//      FidFilter fidFilter = ff.createFidFilter(ID);

        Id idFilter = SITFilterFactory.id(ID);        
        DataStore ds = null;

        try {
            ds = getDataStore();    
            FeatureWriter<SimpleFeatureType, SimpleFeature> fw = ds.getFeatureWriter(configBean.getTypeNameScrittura(), idFilter, transaction);

            while (fw.hasNext()) {
                fw.next();
                fw.remove();
            }

            fw.close();

        } catch (IOException e) {
            logger.warn(this.getClass().getName() + " IOException durante elinazione feature",e);
            throw e;
        } catch (SITException e) {
            logger.warn(this.getClass().getName() + " SITException durante elinazione feature",e);
            throw e;
        }     
    }

    /**
     * Consente di modificare un oggetto territorio contenuto in questo layer.
     * Le modifiche possono riguardare sia la parte alfanumerica che la geometria.
     * L'oggetto passato come parametro (oggettoTer) verrà sostituito a quello 
     * attualmente presente e caratterizzato dallo stesso ID (vedi esempio successivo).
     * <br><br>
     * Per esempio se vogliamo modificare sia il nome che la geometria di una circoscrizione esistente:<br>
     *  <br>
     * <br><pre>
     // Ricerca della circoscrizione da modificare<
     LayerCircoscrizioni layerCirc= ComunePO.getCircoscrizioni();
     PoligonoCircoscrizione nuovaCirc = layerCirc.cercaCircoscrizione("CENTRO");

     if (nuovaCirc==null) {
         System.out.println("Errore nella ricerca della circoscrizione inserita");
         return false;
     }
     // Modifica di campo attributo
     try {
         nuovaCirc.setCircoscrizione("Modificata");
     } catch (SITIllegalAttributeException e) {
         System.out.println("Errore SITIllegalAttributeException modificando il nome della circoscrizione");
         return false;
     }

     // Modifica della geometria
     // In questo caso decidiamo di copiare la geometria della circoscrizione nord
     // E' comunque possibile utilizzare una qualsiasi stringa WKT valida 
     PoligonoCircoscrizione circNord = layerCirc.cercaCircoscrizione("NORD");

     if (circNord==null) {
         System.out.println("Errore nella ricerca della circoscrizione NORD");
         return false;
     }   
     // Estrazione della geometria della circoscrizione NORD
     String circNordWKT = circNord.getGeometryAttributeWKT();

     // Assegnazione della geometria della circoscrizione NORD alla circoscrizione da modificare
     try {
         nuovaCirc.setGeometryAttributeWKT(circNordWKT);
     } catch (SITParseException e) {
         System.out.println("Eccezione SITParseException assegnando la nuova geometria");
         return false;
     } catch (SITIllegalAttributeException e) {
         System.out.println("Errore SITIllegalAttributeException modificando la geometria");
         return false;
     }

     // Effettiva scrittura delle modifiche
     try {
         layerCirc.modifyFeature(nuovaCirc);
     } catch (IOException e) {
         System.out.println("Eccezione IOException modificando la circoscrizione appena inserita");
         return false;
     } catch (SITParseException e) {
         System.out.println("Eccezione SITParseException modificando la circoscrizione appena inserita");
         return false;
     } catch (SITIllegalAttributeException e) {
         System.out.println("Errore SITIllegalAttributeException modificando la circoscrizione appena inserita");
         return false;
     }
     </pre>
     * 
     * 
     * @param oggettoTer Oggetto modificato da scrivere
     * @throws IOException Errore generico nell'accesso al DBStore
     * @throws SITException 
     * @throws SQLException 
     * @throws SITParseException Errore di parsing della stringa WKT
     */
    public void modifyFeature(OggettoTerritorio oggettoTer)throws IOException, SITException, SQLException {
        modifyFeature(oggettoTer, null);
    }

    /**
     * Consente di modificare un oggetto territorio contenuto in questo layer.
     * Le modifiche possono riguardare sia la parte alfanumerica che la geometria.
     * L'oggetto passato come parametro (oggettoTer) verrà sostituito a quello 
     * attualmente presente e caratterizzato dallo stesso ID.
     * 
     * @param oggettoTer Oggetto modificato da scrivere
     * @param transaction Transazione
     * @throws IOException Errore generico nell'accesso al DBStore
     * @throws SITException 
     * @throws SQLException 
     * @throws SITParseException Errore di parsing della stringa WKT
     */
    public void modifyFeature(OggettoTerritorio oggettoTer, SITTransaction transaction) throws IOException, SITException, SQLException {

        String ID = null;

        try {
            ID = getFIDScrittura(oggettoTer);
        } catch (SITFIDMapperException e) {
            logger.warn(this.getClass().getName() + " SITFIDMapperException durante recupero FIDScrittura",e);
            throw e;
        } catch (IOException e) {
            logger.warn(this.getClass().getName() + " IOException durante recupero FIDScrittura",e);
            throw e;
        } catch (SITException e) {
            logger.warn(this.getClass().getName() + " SITException durante recupero FIDScrittura",e);
            throw e;
        } catch (SQLException e) {
            logger.warn(this.getClass().getName() + " SQLException durante recupero FIDScrittura",e);
            throw e;
        }       

//      TOB	    
//      FilterFactory ff = FilterFactory.createFilterFactory();
//      FidFilter fidFilter = ff.createFidFilter(ID);

        Id idFilter = SITFilterFactory.id(ID);

        HashMap<String, String> nch = oggettoTer.getFlagVariazione();

        ArrayList<Object> objAttrs = new ArrayList<Object>();
        ArrayList<String> nc = new ArrayList<String>();

        Iterator<String> iter = nch.values().iterator();

        DataStore ds = null;
        try {
            while (iter.hasNext()) {

                String nome = (String) iter.next();
                if (nome.equals("##GEOM##")) {
//                  TOB                	
//                  nc.add(getDataStore().getSchema(configBean.getTypeName()).getDefaultGeometry().getName());
                    ds = getDataStore();
                    nc.add(ds.getSchema(configBean.getTypeName()).getGeometryDescriptor().getLocalName());
                    objAttrs.add(oggettoTer.getFeat().getDefaultGeometry());
                } else {
                    objAttrs.add( oggettoTer.getAttribute(nome));
                    nc.add(nome);
                }
            }
        } catch (IOException e) {
            logger.warn(this.getClass().getName() + " IOException durante recupero campi",e);
            throw e;
        } catch (SITException e) {
            logger.warn(this.getClass().getName() + " SITException durante recupero campi",e);
            throw e;
        }

        // ////////////////////////////////////////////////////////
        // Utilizzo WKTString == null perchè il campo Geometry 
        // e' eventualmente incluso in nc
        // ////////////////////////////////////////////////////////

        try {
            if (transaction == null) {
                modifyFeatureWKT(null, nc, objAttrs, idFilter);
            } else {
                modifyFeatureWKT(null, nc, objAttrs, idFilter, transaction);
            }
        } catch (SITParseException e) {

            // ///////////////////////////////////////////////////////////////
            // L'errore non si puo' verificare perche' la chiamata utilizza 
            // null come WKTString in quanto la geometria e' già presente   
            // ///////////////////////////////////////////////////////////////

        } catch (SITIllegalAttributeException e) {
            logger.warn(this.getClass().getName() + " SITIllegalAttributeException durante modifyFeatureWKT",e);
            throw e;
        }  catch (IOException e) {
            logger.warn(this.getClass().getName() + " IOException durante modifyFeatureWKT",e);
            throw e;  
        } catch (SITException e) {
            logger.warn(this.getClass().getName() + " SITException durante modifyFeatureWKT",e);
            throw e;
        }	    
    }

    /**
     * 
     * @param oggDaMod
     * @param polModifica
     * @param clippingLayer
     * @throws IOException
     * @throws SITException
     * @throws SQLException 
     * 
     * @see {@link LayerTerritorio#modifyAndClipCopertura(OggettoTerritorio oggDaMod, OggettoTerritorio polModifica, LayerTerritorio clippingLayer, SITTransaction transaction)}
     */
    public void modifyAndClipCopertura(OggettoTerritorio oggDaMod, OggettoTerritorio polModifica, 
            LayerTerritorio clippingLayer) throws IOException, SITException, SQLException{
        modifyAndClipCopertura(oggDaMod, polModifica, clippingLayer, null);    
    }

    /**
     * 
     * @param oggDaMod
     * @param polModifica
     * @throws IOException
     * @throws SITException
     * @throws SQLException
     * 
     * @see {@link LayerTerritorio#modifyCopertura(OggettoTerritorio oggDaMod, OggettoTerritorio polModifica, SITTransaction transaction)}
     */
    public void modifyCopertura(OggettoTerritorio oggDaMod, OggettoTerritorio polModifica) throws IOException, SITException, SQLException{
        modifyCopertura(oggDaMod, polModifica, null);    
    }

    /**
     * Il metodo permette di modifcare la copertura fra i poligoni del layer e di vincolare tale modifica ad un layer
     * che ne limita i confini 
     * 
     * @param oggDaMod {@link OggettoTerritorio} da modificare
     * @param polModifica {@link OggettoTerritorio} che rappresenta il poligono di modifica
     * @param clippingLayer {@link LayerTerritorio} layer di vincolo
     * @param transaction {@link SITTransaction}
     * @throws IOException
     * @throws SITException
     * @throws SQLException 
     */
    public void modifyAndClipCopertura(OggettoTerritorio oggDaMod, OggettoTerritorio polModifica, 
            LayerTerritorio clippingLayer, SITTransaction transaction) throws IOException, SITException, SQLException {

        List<OggettoTerritorio> chiContiene = clippingLayer.chiCopre(oggDaMod);

        if(chiContiene == null || chiContiene.size() == 0){
            throw new SITException("L'oggetto da modificare non e' contenuto in nessuno dei poligoni del layer di vincolo");
        }

        if(chiContiene.size() > 1){
            throw new SITException("L'oggetto da modificare e' contenuto in piu' poligoni del layer di vincolo");
        }

        OggettoTerritorio clipper = chiContiene.get(0);       
        modifyCopertura(oggDaMod, polModifica, clipper, transaction);       
    }

    /**
     * 
     * @param oggDaMod
     * @param polModifica
     * @param transaction
     * @throws IOException
     * @throws SITException
     * @throws SQLException
     * 
     * @see {@link LayerTerritorio#modifyCopertura(OggettoTerritorio oggDaMod, OggettoTerritorio polModifica, OggettoTerritorio clipper, SITTransaction transaction)}
     */
    public void modifyCopertura(OggettoTerritorio oggDaMod, OggettoTerritorio polModifica, 
            SITTransaction transaction) throws IOException, SITException, SQLException{
        modifyCopertura(oggDaMod, polModifica, null, transaction);
    }

    /**
     * Il metodo permette di modifcare la copertura fra i poligoni del layer.
     * 
     * @param oggDaMod
     * @param polModifica
     * @param clipper
     * @param transaction
     * @throws IOException
     * @throws SITException
     * @throws SQLException
     */
    public void modifyCopertura(OggettoTerritorio oggDaMod, OggettoTerritorio polModifica, 
            OggettoTerritorio clipper, SITTransaction transaction) throws IOException, SITException, SQLException {

        SITTransaction transaction1 = null;
        boolean isNewTransaction = false;

        try{
            // Se non viene passata la transazione ne istanzio una
            if (transaction == null) {
                transaction1 = new SITDefaultTransaction();
                isNewTransaction = true;
            } else {
                transaction1 = transaction;
            }

            ArrayList<OggettoTerritorio> oggettiDaMod;

            try {                                    
                oggettiDaMod = this.chiInterseca(polModifica);                                

            } catch (IOException e) {
                logger.warn("IOException durante intersezione con poligono modifica",e);
                throw e;
            } catch (SITIllegalFilterException e) {
                logger.warn("SITIllegalFilterException durante intersezione con poligono modifica",e);
                throw e;
            } catch (SITException e) {
                logger.warn("SITException durante intersezione con poligono modifica",e);
                throw e;
            }

            Iterator<OggettoTerritorio> iter = oggettiDaMod.iterator(); 

            while (iter.hasNext()) {
                OggettoTerritorio element = (OggettoTerritorio) iter.next();
                if (element.getFeat().getID()!=oggDaMod.getFeat().getID()){
                    try {
                        if(clipper != null){
                            if(!clipper.copre(element))
                                continue;
                        }
                        element.differenza(polModifica);
                        modifyFeature(element,transaction1);
                    } catch (SITIllegalAttributeException e) {
                        if (isNewTransaction) {
                            transaction1.rollback();
                        }
                        logger.error("SITIllegalAttributeException durante modifica con copertura",e);
                        throw e;
                    } catch (SITGeometryCastNotSupported e) {
                        if (isNewTransaction) {
                            transaction1.rollback();
                        }
                        logger.error("SITGeometryCastNotSupported durante modifica con copertura",e);
                        throw e;
                    } catch (IOException e) {
                        if (isNewTransaction) {
                            transaction1.rollback();
                        }
                        logger.error("IOException durante modifica con copertura",e);
                        throw e;
                    } catch (SITFIDMapperException e) {
                        if (isNewTransaction) {
                            transaction1.rollback();
                        }
                        logger.error("SITFIDMapperException durante modifica con copertura",e);
                        throw e;
                    } catch (SITException e) {
                        logger.error("SITException durante modifica con copertura",e);
                        throw e;
                    } catch (SQLException e) {
                        logger.error("SQLException durante modifica con copertura",e);
                        throw e;
                    }
                }
            }

            try {
                oggDaMod.unione(polModifica);
                if(clipper != null){
                    oggDaMod.intersezione(clipper);
                }
                modifyFeature(oggDaMod, transaction1);
            } catch (SITIllegalAttributeException e) {
                if (isNewTransaction) {
                    transaction1.rollback();
                }
                logger.error("SITIllegalAttributeException durante modifica con copertura",e);
                throw e;
            } catch (SITGeometryCastNotSupported e) {
                if (isNewTransaction) {
                    transaction1.rollback();
                }
                logger.error("SITGeometryCastNotSupported durante modifica con copertura",e);
                throw e;
            } catch (IOException e) {
                if (isNewTransaction) {
                    transaction1.rollback();
                }
                logger.error("IOException durante modifica con copertura",e);
                throw e;
            } catch (SITException e) {
                logger.error("SITException durante modifica con copertura",e);
                throw e;
            }

            if (isNewTransaction) {
                transaction1.commit();
            }

        }finally{
            if (isNewTransaction && transaction1 != null) {
                transaction1.close();
            }
        }        
    }

    /**
     * Inserisce un nuovo oggetto territoriale in questo layer.<br>
     * <br>
     * Per esempio per inserire una nuova circoscrizione dal nome "NuovaCircoscrizione"<br> 
     * <br><pre>
     ComunePO = new Territorio("prova", "0.0.0.0", "C:\\ConfigSIT.txt", "c:\\logSITProve.txt", true, "Comune di Prato");

     LayerCircoscrizioni circ = ComunePO.getCircoscrizioni();
     PoligonoCircoscrizione polcirc = null; 

     // Creazione di un oggetto vuoto per il layer selezionato
     // ..in questo caso un nuovo oggetto circoscrizione
     try {
         polcirc = (PoligonoCircoscrizione)  circ.creaNuovoOggettoTerritorio();    
     } catch (IOException e) {
         System.out.println("Impossibile Inserimento: IOException durante la creazione di un poligono vuoto");
         return false;
     }

     // Assegnazione valori agli attributi alfanumerici
     // In questo caso viene assegnato il valore contenuto in szNomeCircoscrizione all'attributo Circoscrizione
     try {
         polcirc.setCircoscrizione("NuovaCircoscrizione");
     } catch (SITIllegalAttributeException e1) {
         System.out.println("Impossibile Inserimento: SITIllegalAttributeException");
         return false;
     }

     // Creazione della stringa contenete la codifica WKT del poligono della circoscrizione
     String geo = "MULTIPOLYGON(((1660436.82350625 4867176.52215365,1660436.82350625 4867176.52215365,1660436.82350625 4867176.52215365,1663742.90230223 4865287.33427023,1660268.14601666 4865388.54076399,1660436.82350625 4867176.52215365)))";

     // Assegnazione della geometria all'oggetto precedentemente creato
     try {
         polcirc.setGeometryAttributeWKT(geo);
     } catch (SITParseException e1) {
         // Errore di parsing della stringa WKT
         System.out.println("Impossibile Inserimento: SITParseException durante l'operazione di inserimento della geometria");
         return false;
     } catch (SITIllegalAttributeException e1) {
         // Valore incompatibile con l'attributo. Per esempio inserimento di 
         // una geometria poligonale in un attributo di tipo puntuale....
        System.out.println("Impossibile Inserimento: SITIllegalAttributeException durante l'inserimento della geometria");
        return false;            
     }

     // Inserimento e salvataggio
     try {
         circ.appendFeature(polcirc);
     } catch (IOException e) {
         System.out.println("Impossibile Inserimento: IOException durante l'operazione di append");
         return false;
     } catch (SITIllegalAttributeException e) {
         System.out.println("Impossibile Inserimento: IOException durante l'operazione di append");
         return false;
     } 
     </pre>
     * 
     * @param oggettoTer Oggetto da inserire in questo layer 
     * @throws IOException Errore generico nell'accesso al DBStore
     * @throws SITException 
     */
    public void appendFeature(OggettoTerritorio oggettoTer) throws IOException, SITException {        
        appendFeature(oggettoTer, null);
    }

    /**
     * Inserisce un nuovo oggetto territoriale in questo layer.<br>
     * <br>
     *
     * 
     * @param oggettoTer Oggetto da inserire in questo layer
     * @param transaction transazione 
     * @throws IOException Errore generico nell'accesso al DBStore
     * @throws SITException 
     */
    public void appendFeature(OggettoTerritorio oggettoTer, SITTransaction transaction) throws IOException, SITException {

        logger.debug("Inizio l'append dell'oggetto: " + oggettoTer.getClass() + " " + oggettoTer.getDescrizione());
        HashMap<String, String> nch = oggettoTer.getFlagVariazione();
        logger.debug("Campi variati dell'oggetto: " + nch);   

        ArrayList<Object> objAttrs = new ArrayList<Object>();     
        ArrayList<String> nc = new ArrayList<String>();

        Iterator<String> iter = nch.values().iterator();        
        DataStore ds = null;

        logger.debug("Itero l'hash map dei campi e dei valori...");
        try {
            while (iter.hasNext()) {

                String nome = (String) iter.next();

                if (nome.equals("##GEOM##")) {
//                  TOB                	
//                  nc.add(getDataStore().getSchema(configBean.getTypeName()).getDefaultGeometry().getName());
                    ds = getDataStore();
                    nc.add(ds.getSchema(configBean.getTypeName()).getGeometryDescriptor().getLocalName());                	
                    objAttrs.add(oggettoTer.getFeat().getDefaultGeometry());
                } else {
                    objAttrs.add( oggettoTer.getAttribute(nome));
                    nc.add(nome);
                    if (oggettoTer.getAttribute(nome)!=null) {
                        logger.debug("Campo: " + nome + " - Valore: " + oggettoTer.getAttribute(nome) + " - Classe: " + oggettoTer.getAttribute(nome).getClass().getName());
                    } else {
                        logger.debug("Campo: " + nome + " - Valore: " + oggettoTer.getAttribute(nome));
                    }
                }
            }

        } catch (IOException e) {
            logger.error("Errore durante recupero campi-valori dell'oggetto: IOException ", e);
            throw e;
        } catch (SITException e) {
            logger.error("Errore durante recupero campi-valori dell'oggetto: SITException ", e);
            throw e;
        }

        SimpleFeature newFeat = null;

        try {
            if (transaction == null){
                newFeat = appendFeatureGeom(null,nc, objAttrs);
            } else {
                newFeat = appendFeatureGeom(null,nc, objAttrs, transaction);
            }

        } catch (IOException e) {
            logger.error("IOException durante aggiunta feature", e);
            throw e;
        } catch (SITIllegalAttributeException e) {
            logger.error("SITIllegalAttributeException durante aggiunta feature",e);
            throw e;
        }

        oggettoTer.setFeat(newFeat);
    }

    /**
     * Restituisce l'ID del layer.
     * 
     * @deprecated Adesso idLayer e codTPN coincidono, utilizzare {@link #getCodTPN()}
     * @return int l'id del layer.
     *
     */
    public int getIDLayer() {
        return getCodTPN();
    }


    /**
     * Restituisce il nome del layer.
     * 
     * @return String il nome.
     * 
     */
    public String getNome() {
        return Nome;
    }

    /**
     * Imposta il nome del layer.
     * 
     * @param nome il nome da impostare.
     * 
     */
    public void setNome(String nome) {
        Nome = nome;
    }

    /**
     * Imposta l'HashMap dei nomi dei campi della tabella.
     * 
     * @return HashMap nomiCampi.
     * 
     */
    public HashMap<String, String> getNomiCampi() {
        return NomiCampi;
    }

    /**
     * Restituisce i nomi dei campi per la scrittura disponibili.
     * 
     * @return HashMap
     */
    public HashMap<String, String> getNomiCampiScrittura() {
        return NomiCampiScrittura;
    }

    /**
     * Restituisce il nome del campo che soddisfa il nome logoco passato come argomento.
     * 
     * @return String
     */
    public String getNomiCampi(String NomeLogico) {
        return (String) getNomiCampi().get(NomeLogico);
    }

    /**
     * Restituisce il nome del campo per la scrittura che soddisfa il nome logoco passato come argomento.
     * 
     * @return String
     */
    public String getNomiCampiScrittura(String NomeLogico) {
        return (String) getNomiCampiScrittura().get(NomeLogico);
    }

    /**
     * Consente di impostare i nomi dei campi della tabella (attributi).
     * 
     * @param nomiCampi il nomiCampi da impostare.
     * 
     */
    public void setNomiCampi(HashMap<String, String> nomiCampi) {
        NomiCampi = nomiCampi;
    } 

    /**
     * Appende una nuove feature alla FeatureType del layer.
     * 
     * @param geometry
     * @param NomiCampi
     * @param objAttrs
     * @return SimpleFeature
     * @throws IOException
     * @throws SITException
     */
    private SimpleFeature appendFeatureGeom(Geometry geometry, ArrayList<String> NomiCampi, ArrayList<Object> objAttrs)throws IOException, SITException{

        SimpleFeature newFeat = null;
        SITTransaction transaction = null;

        try {

            transaction = new SITDefaultTransaction();
            newFeat = appendFeatureGeom(geometry, NomiCampi, objAttrs, transaction);
            transaction.commit();

        } catch (IOException e) {
            transaction.rollback();
            logger.error(this.getClass().getName() + ": IOException durante esecuzione appendFeatureGeom",e);
            throw (e);
        } catch (SITIllegalAttributeException e) {
            transaction.rollback();
            logger.error(this.getClass().getName() + ": SITIllegalAttributeException durante esecuzione appendFeatureGeom",e);
            throw (e);
        } catch (SITException e) {
            logger.error(this.getClass().getName() + ": SITException durante esecuzione appendFeatureGeom",e);
            throw e;
        } finally {
            if(transaction != null){
                transaction.close();
            }
        }

        return newFeat;                
    }

    /**
     * Appende una nuove feature alla FeatureType del layer.
     * 
     * @param geometry
     * @param NomiCampi
     * @param objAttrs
     * @param transaction
     * @return SimpleFeature
     * @throws IOException
     * @throws SITException
     */
    private SimpleFeature appendFeatureGeom(Geometry geometry, ArrayList<String> NomiCampi, ArrayList<Object> objAttrs, 
            SITTransaction transaction) throws IOException, SITException{

        SimpleFeature newFeat = null;
        DataStore ds = null;

        try {
            ds = getDataStore();        
        } catch (IOException e) {
            logger.error(this.getClass().getName() + ": errore durante recupero DataStore",e);
            throw e;
        } catch (SITException e) {
            logger.error(this.getClass().getName() + ": errore durante recupero DataStore",e);
            throw e;
        }

        try {   
            JDBCFeatureStore featureStore = null;
            SimpleFeatureBuilder b = null;
            Collection<SimpleFeature> collection = null;
            String typeName = null;
            SimpleFeature feature = null;

            if(!(ds instanceof ShapefileDataStore)){
                featureStore = (JDBCFeatureStore) ds.getFeatureSource(configBean.getTypeNameScrittura());  
                featureStore.setTransaction(transaction);

                b = new SimpleFeatureBuilder(featureStore.getSchema());
                collection = new DefaultFeatureCollection(null, featureStore.getSchema());

                typeName = b.getFeatureType().getTypeName();
            }

            if(featureStore != null && featureStore.isExposePrimaryKeyColumns()){
                String pkName = null;
                List<PrimaryKeyColumn> listPK = featureStore.getPrimaryKey().getColumns();

                for (int i=0; i<NomiCampi.size(); i++) {
                    for(int y=0; y<listPK.size(); y++){
                        if(listPK.get(y).getName().equalsIgnoreCase(NomiCampi.get(i)))
                            pkName = NomiCampi.get(i);
                    }
                }

                Object fid = null;

                for (int i=0; i<NomiCampi.size(); i++) {                	
                    if(NomiCampi.get(i).equalsIgnoreCase(pkName)){
                        fid = objAttrs.get(i);
                        b.set((String)NomiCampi.get(i), fid);
                    }else{
                        b.set((String)NomiCampi.get(i), objAttrs.get(i));
                    }            		
                }

                b.featureUserData(Hints.USE_PROVIDED_FID, Boolean.TRUE);

                feature = b.buildFeature(typeName + "." + fid);
                collection.add(feature);

                featureStore.addFeatures(collection);

                newFeat = feature;
            }else{
//              TOB
//              for (int i=0; i<NomiCampi.size(); i++)         	
//              b.set((String)NomiCampi.get(i), objAttrs.get(i));    		

//              feature = b.buildFeature(SimpleFeatureBuilder.createDefaultFeatureId());
//              collection.add(feature);

//              featureStore.addFeatures(collection);

                FeatureWriter<SimpleFeatureType, SimpleFeature> fw = ds.getFeatureWriterAppend(configBean.getTypeNameScrittura(), transaction);

                SimpleFeature f = (SimpleFeature)fw.next();            

                for (int i=0;i<NomiCampi.size();i++) {
                    f.setAttribute((String)NomiCampi.get(i), objAttrs.get(i));           
                }

                if (geometry != null) {
                    f.setDefaultGeometry(geometry);
                }

                fw.write();    

                // /////////////////////////////////////////////////////////////////////////
                // Si crea una nuova copia della SimpleFeature e se ne settano i campi
                // /////////////////////////////////////////////////////////////////////////

                String fid = f.getIdentifier().getID();
                newFeat = DataUtilities.template(this.getFeatureType(), fid);

                for (int i=0;i<NomiCampi.size();i++) {
                    newFeat.setAttribute((String)NomiCampi.get(i), objAttrs.get(i));
                }

                if (geometry != null) {
                    newFeat.setDefaultGeometry(geometry);
                }

                fw.close();   
            }

        }  catch (IllegalAttributeException e) {
            String errMsg = this.getClass().getName() + ": IllegalAttributeException durante esecuzione appendFeatureGeom";
            logger.error(errMsg,e);
            throw new SITIllegalAttributeException(errMsg, e);
        }

        return newFeat;        
    }

    abstract public int getContentTypeLayer();

    /**
     * Controlla se il layer è un layer di punti o meno.
     * 
     * @return boolean.
     */
    public boolean isLayerOfPoints(){
        return getContentTypeLayer() == LAYER_OF_POINTS;
    }

    /**
     * Controlla se il layer è un layer di linee meno.
     * 
     * @return boolean.
     */
    public boolean isLayerOfLines(){
        return getContentTypeLayer() == LAYER_OF_LINES;
    }

    /**
     * Controlla se il layer è un layer di poligoni o meno.
     * 
     * @return boolean
     */
    public boolean isLayerOfPolygons(){
        return getContentTypeLayer() == LAYER_OF_POLYGONS;
    }

    /**
     * Ritorna il valore del CodTPN del layer.
     * 
     * @return int
     */
    public int getCodTPN() {
        return codTPN;
    }

    /**
     * Cerca un poligono per IDTPN.
     * 
     * @param idTPN
     * @return OggettoTerritorio
     */
    public OggettoTerritorio cercaIDTPN (String idTPN) {
        return cercaIDTPN(idTPN, null);
    }

    /**
     * Cerca un poligono per IDTPN.
     * 
     * @param idTPN
     * @param tr
     * @return OggettoTerritorio
     */
    public OggettoTerritorio cercaIDTPN (String idTPN, SITTransaction tr ) {
        return cercaIDTPN ( idTPN, tr, Layers.NL_IDTPN );
    }

    /**
     * Cerca un poligono per IDTPN.
     * 
     * @param idTPN
     * @param tr
     * @param NLCampo
     * @return OggettoTerritorio
     */
    public OggettoTerritorio cercaIDTPN(String idTPN, SITTransaction tr, String NLCampo ) {

        if ((getNomiCampi(NLCampo)!=null) && (!getNomiCampi(NLCampo).toUpperCase().equals(Layers.NL_FID))) {
            ArrayList<String> valore = new ArrayList<String>();
            ArrayList<String> campi = new ArrayList<String>();

            campi.add(NLCampo);

            valore.add(idTPN);

            return cercaPoligono(campi, valore, tr);

        } else {
            try {
                filtroTotale = this.getFiltroVuoto();
                filtroTotale.addFiltroByFID(idTPN);

                ArrayList<?> ris =  cercaFiltro(tr);
                if ((ris==null) || ris.size()==0) {
                    return null;
                } else {
                    return (OggettoTerritorio) ris.get(0);
                }
            } catch (SITException e) {
                logger.error("Errore durante il recupero dell'oggetto terrioriale tramite chiave",e);
                return null;
            }       
        }
    }

    /**
     * Esegue la validazione della geometria cioe' verifica se la geometria contenuta in oggDaValidare 
     * è adatta ad essere inserita nel layer. Questo metodo non esegue alcuna validazione, se necessario farla deve essere 
     * sovrascritto per i layer che necessitano la validazione
     * 
     * @param oggDaValidare
     * @return lista degli errori di validazione che si sono verificati oppure null se la validazione ha avuto successo
     */
    public List<SITBaseError> validateGeometry(OggettoTerritorio oggDaValidare) throws SITException {
        return null;
    }   

    /**
     * Esegue la validazione della geometria cioe' verifica se la geometria contenuta in jsGeometryDaValidare </br>
     * è adatta ad essere inserita nel layer. Questo metodo richiama validateGeometry(OggettoTerritorio oggDaValidare), </br>
     * che non esegue alcuna validazione, se necessario farla deve essere  sovrascritto per i layer che necessitano la validazione
     * 
     * @param jsGeometryDaValidare
     * @return lista degli errori di validazione che si sono verificati oppure null se la validazione ha avuto successo
     */
    public final List<SITBaseError> validateGeometry(String jsGeometryDaValidare) throws SITException {
        return validateGeometry(JSGeometry.jsGeometryToOggettoTerritorio(configBean.getLayersManager(), jsGeometryDaValidare, logger));
    }
    
    /**
     * Restituisce la Geometry dell'OggettoTerritorio
     * @param oggettoTerritorio
     * @return com.vividsolutions.jts.geom.Geometry
     */
    private Geometry getGeometryFromOggettoTerritorio(OggettoTerritorio oggettoTerritorio){
    	return (Geometry)oggettoTerritorio.getFeat().getDefaultGeometry();
    }

    // [regionend]

    /**
     * Questo metodo restituisce la data a cui uno strato è aggiornato.
     * Tale data viene recuperata per mezzo di un DAO da una tabella presente su SIT. 
     * 
     * @return DateType
     * @throws SITException
     */
    public DateType getLastUpdate() throws SITException{

        Connection sitConn = null;
        DateType dtUpdate = null;       

        try{

            sitConn = configBean.getLayersManager().getSitStandardConnection();

            LayerLastUpdateDAO lluDAO = new LayerLastUpdateDAO(logger);

            dtUpdate = lluDAO.getLastUpdate(codTPN, sitConn);

        }catch (SQLException sqle){
            String msg = "Errore durante il recupero della data di ultimo aggiornamento del layer " + codTPN;
            logger.error(msg,sqle);
            throw new SITException(msg);
        }finally{
            if(sitConn != null){
                try{
                    sitConn.close();
                }catch(Exception e){
                    logger.error("Impossibile chiudere la connessione",e);
                }
            }        
        }

        return dtUpdate;
    }

    /**
     * Restituisce il nome del campo geometria di questo layer.
     * 
     * @return String Nome del campo geometria
     * @throws SITException  
     */
    public String getGeometryFieldName() throws SITException {
        return getFeatureType().getGeometryDescriptor().getLocalName();
    }

    /**
     * Metodo per recuperare il nome del typename (nome tabella in caso di fonte db)
     * @return ritorna il typename
     */
    public String getTypeName() {
    	return configBean.getTypeName();
    }

	/* (non-Javadoc)
	 * @see it.prato.comune.sit.IGetFeatureInfoLayer#getFeatureInfo(it.prato.comune.sit.GetFeatureInfoParams)
	 */
	public List<IGetFeatureInfoObject> getFeatureInfo(
			GetFeatureInfoParams params) throws SITException {
		
		List<IGetFeatureInfoObject> retVal = null;
		
		try {
			retVal = chiInterseca(params.getCoordX(), params.getCoordY(), params.getRange(), params.getSourceSRID());
		} catch (IOException e) {
			String msg="IOException nel metodo getFeatureInfo ";
			logger.warn(msg, e);
			throw new SITException(msg,e);
		} catch (SITException e) {
			String msg="SITException nel metodo getFeatureInfo ";
			logger.warn(msg, e);
			throw new SITException(msg,e);
		}
		
		return retVal;
	}

	/* (non-Javadoc)
	 * @see it.prato.comune.sit.IGetFeatureInfoLayer#getSRID()
	 */
	
	public String getSRID() throws SITException {
		String code = null;
		
		try {
		
			code = "EPSG:" + CRS.lookupEpsgCode( getCRS(), true );
		} catch (FactoryException e) {
			String msg="FactoryException nel metodo getSRID ";
			logger.warn(msg, e);
			throw new SITException(msg,e);
		} catch (SITException e) {
			String msg="SITException nel metodo getSRID ";
			logger.warn(msg, e);
			throw e;
		} 
		
		
		return code;
	}

	/**
	 * @return the espressioneDescrizione
	 */
	public String getEspressioneDescrizione() {
		return espressioneDescrizione;
	}

	/**
	 * @param espressioneDescrizione the espressioneDescrizione to set
	 */
	public void setEspressioneDescrizione(String espressioneDescrizione) {
		this.espressioneDescrizione = espressioneDescrizione;
	}

	/* (non-Javadoc)
	 * @see it.prato.comune.sit.IGetFeatureInfoLayer#setEspressioneIDTPN(java.lang.String)
	 */
	public void setEspressioneIDTPN(String espressioneIDTPN) {
		this.espressioneIDTPN = espressioneIDTPN;
		
	}

	/* (non-Javadoc)
	 * @see it.prato.comune.sit.IGetFeatureInfoLayer#getEspressioneIDTPN()
	 */
	public String getEspressioneIDTPN() {
		return this.espressioneIDTPN;
	}

	/* (non-Javadoc)
	 * @see it.prato.comune.sit.IGetFeatureInfoLayer#setEspressioneNomeOggetto(java.lang.String)
	 */
	public void setEspressioneNomeOggetto(String espressioneNomeOggetto) {
		this.espressioneNomeOggetto = espressioneNomeOggetto;
		
	}

	/* (non-Javadoc)
	 * @see it.prato.comune.sit.IGetFeatureInfoLayer#getEspressioneNomeOggetto()
	 */
	public String getEspressioneNomeOggetto() {
		return this.espressioneNomeOggetto;
	}
	
	/**
	 * @return the espressioneDescrizioneSuggest
	 */
	public List<String> getEspressioneDescrizioneSuggest() {
		return espressioneDescrizioneSuggest;
	}

	/**
	 * @param espressioneDescrizioneSuggest the espressioneDescrizioneSuggest to set
	 */
	public void setEspressioneDescrizioneSuggest(
			List<String> espressioneDescrizioneSuggest) {
		this.espressioneDescrizioneSuggest = espressioneDescrizioneSuggest;
	}

	/**
	 * @return the nomiCampiLegibili
	 */
	public HashMap<String, String> getNomiCampiLegibili() {
		return nomiCampiLegibili;
	}

	/**
	 * @param nomiCampiLegibili the nomiCampiLegibili to set
	 */
	public void setNomiCampiLegibili(HashMap<String, String> nomiCampiLegibili) {
		this.nomiCampiLegibili = nomiCampiLegibili;
	}

	/**
	 * @return the attributiRegEx
	 */
	public HashMap<String, String> getAttributiRegEx() {
		return attributiRegEx;
	}

	/**
	 * @param attributiRegEx the attributiRegEx to set
	 */
	public void setAttributiRegEx(HashMap<String, String> attributiRegEx) {
		this.attributiRegEx = attributiRegEx;
	}

	/**
	 * @return the attributiReadWrite
	 */
	public HashMap<String, String> getAttributiReadWrite() {
		return attributiReadWrite;
	}

	/**
	 * @param attributiReadWrite the attributiReadWrite to set
	 */
	public void setAttributiReadWrite(HashMap<String, String> attributiReadWrite) {
		this.attributiReadWrite = attributiReadWrite;
	}

	/**
	 * @return the attributiFk
	 */
	public HashMap<String, String> getAttributiFk() {
		return attributiFk;
	}

	/**
	 * @param attributiFk the attributiFk to set
	 */
	public void setAttributiFk(HashMap<String, String> attributiFk) {
		this.attributiFk = attributiFk;
	}

	/**
	 * @return the dateFormat
	 */
	public String getDateFormat() {
		return dateFormat;
	}

	/**
	 * @param dateFormat the dateFormat to set
	 */
	public void setDateFormat(String dateFormat) {
		this.dateFormat = dateFormat;
	}

	/**
	 * @return the defaultAttributeValues
	 */
	public HashMap<String, String> getDefaultAttributeValues() {
		return defaultAttributeValues;
	}

	/**
	 * @param defaultAttributeValues the defaultAttributeValues to set
	 */
	public void setDefaultAttributeValues(
			HashMap<String, String> defaultAttributeValues) {
		this.defaultAttributeValues = defaultAttributeValues;
	}
	
//  [regionend]

}