var actualNode;
var actualNode2;
var treePanelPersp;
var treePanelM;
Ext.onReady(function(){

    var toolBarPers = new Ext.Toolbar({
        items:[{
            iconCls:"persp",
            text:"Perspectives",
            menu:{
                items:[{
                    iconCls:"new",
                    text:"New",
                    handler:function(){
                        if (actualNode!=undefined &&
                                actualNode.attributes.type=="strategy"){
                            perspective.method="POST";
                            perspective.url="perspectives/create";
                            perspective.form.getForm().reset();
                            perspective.form.items.map.perspective_strategy_id.
                                setValue(strategy.id);
                            perspective.win.show();
                        }else{
                            Ext.Msg.alert("Error","You must select an strategy")
                        }
                    }
                },{
                    iconCls:"edit",
                    text:"Edit",
                    handler:function(){
                        if (perspective.id>0 &&
                                actualNode2.attributes.type=="perspective"){
                            perspective.method="PUT";
                            perspective.url="/perspectives/"+perspective.id;
                            perspective.form.getForm().load({
                               method:"GET",
                               url:"/perspectives/"+perspective.id+"/edit"
                            });
                            perspective.win.show();
                        }else{
                            Ext.Msg.alert("Error","You must select a perspective");
                        }
                    }
                },{
                    iconCls:"del",
                    text:"Delete",
                    handler:function(){
                        if (perspective.id>0 &&
                                actualNode2.attributes.type=="perspective"){
                              general.deletion("/perspectives/"+perspective.id,treePanelPersp);
                        }else{
                            Ext.Msg.alert("Error","You must select a perspective");
                        }
                    }
                }]
            }
        },{
            iconCls:"objs",
            text:"Objectives",
            menu:{
                items:[{
                    iconCls:"new",
                    text:"New",
                    handler:function(){
                        if (actualNode2.attributes.type=="perspective" ||
                                actualNode2.attributes.type=="objective"){
                            objective.method="POST";
                            objective.url="objectives/create";
                            objective.form.getForm().reset();
                            objective.form.items.map.objective_perspective_id.
                                setValue(perspective.id);
                            objective.form.items.map.objective_objective_id.
                                setValue(objective.id);
                            objective.win.show();
                        }else{
                            Ext.Msg.alert("Error","You must select a perspective or objective");
                        }
                    }
                },{
                    iconCls:"edit",
                    text:"Edit",
                    handler:function(){
                        if (objective.id>0 &&
                                actualNode2.attributes.type=="objective"){
                            objective.method="PUT";
                            objective.url="/objectives/"+objective.id;
                            objective.form.getForm().load({
                               method:"GET",
                               url:"/objectives/"+objective.id+"/edit"
                            });
                            objective.win.show();
                        }else{
                            Ext.Msg.alert("Error","You must select an objective");
                        }
                    }
                },{
                    iconCls:"del",
                    text:"Delete",
                    handler:function(){
                        if (objective.id>0 &&
                                actualNode2.attributes.type=="objective"){
                              general.deletion("/objectives/"+objective.id,treePanelPersp);
                        }else{
                            Ext.Msg.alert("Error","You must select an objective");
                        }
                    }
                }]
            }
        }]
    });

    var toolBarOrgs = new Ext.Toolbar({
        items:[{
            iconCls:"orgs",
            text:"Organizations",
            menu:{
              items:[{
                iconCls:"new",
                text:"New",
                handler:function(){
                    organization.method="POST";
                    organization.url="organizations/create";
                    organization.form.getForm().reset();
                    organization.form.items.map.organization_organization_id.
                        setValue(organization.id);
                    organization.win.show();
                }
              },{
                iconCls:"edit",
                text:"Edit",
                handler:function(){
                    if (organization.id>0 &&
                            actualNode.attributes.type=="organization"){
                        organization.method="PUT";
                        organization.url="/organizations/"+organization.id;
                        organization.form.getForm().load(
                            {method:'GET',
                             url:'/organizations/'+organization.id+'/edit'});
                        organization.win.show();
                    }else{
                        Ext.Msg.alert("Error","You must select an organization");
                    }
                }
              },{
                iconCls:"del",
                text:"Delete",
                handler:function(){
                    if (organization.id>0 &&
                            actualNode.attributes.type=="organization"){
                          general.deletion("/organizations/"+organization.id,treePanelOrgs);
                    }else{
                        Ext.Msg.alert("Error","You must select an organization");
                    }
                }
              }]
            }
        },{
            iconCls:"strats",
            text:"Strategies",
            menu:{
              items:[{
                iconCls:"new",
                text:"New",
                handler:function(){
                    if (organization.id>0 &&
                            actualNode.attributes.type=="organization"){
                        strategy.method="POST";
                        strategy.url="strategies/create";
                        strategy.form.getForm().reset();
                        strategy.form.items.map.strategy_organization_id.
                            setValue(organization.id);
                        strategy.win.show();
                    }else{
                        Ext.Msg.alert("Error","You must select an organization");
                    }
                }
              },{
                iconCls:"edit",
                text:"Edit",
                handler:function(){
                    if (strategy.id>0 &&
                            actualNode.attributes.type=="strategy"){
                        strategy.method="PUT";
                        strategy.url="/strategies/"+strategy.id;
                        strategy.form.getForm().load(
                            {method:'GET',
                             url:'/strategies/'+strategy.id+'/edit'});
                        strategy.win.show();
                    }else{
                        Ext.Msg.alert("Error","You must select a strategy");
                    }                    
                }
              },{
                iconCls:"del",
                text:"Delete",
                handler:function(){
                    if (strategy.id>0 &&
                            actualNode.attributes.type=="strategy"){
                          general.deletion("/strategies/"+strategy.id,treePanelOrgs);
                    }else{
                        Ext.Msg.alert("Error","You must select a strategy");
                    }
                }
              }]
            }            
        }]
    });
    
    treePanelPersp = new Ext.tree.TreePanel({
    	id: 'tree-panel_persp',
        title: 'Perspectives and Objectives',
        region: 'north',
        height: 300,
        autoScroll: true,
        rootVisible: false,
        useArrows: true,
        tbar:[toolBarPers],
        loader: new Ext.tree.TreeLoader({
            requestMethod:"GET",
            dataUrl:function() {return '/persp_and_objs?strategy_id='+strategy.id;}
        }),
        listeners:{
            click:function(n){
                actualNode2=n;
                if (n.attributes.type=="perspective"){
                    perspective.id=n.attributes.iddb;
                    objective.id=0;
                }else{
                    perspective.id=0;
                    objective.id=n.attributes.iddb;
                    treePanelM.getRootNode().reload();
                }
            }
        },
        root: new Ext.tree.AsyncTreeNode()
    });

    var measuresToolBar=new Ext.Toolbar({
        items:[{
           text:"Measures",
           iconCls:"measure",
           menu:{
               items:[{
                   text: "New",
                   iconCls: "new",
                   handler:function(){
                        if (objective.id>0){
                            measure.method="POST";
                            measure.url="measures/create";
                            measure.form.getForm().reset();
                            measure.form.items.map.measure_objective_ids.
                                setValue(objective.id);
                            measure.win.show();
                        }else{
                            Ext.Msg.alert("Error","You must select an objective");
                        }
                   }
               },{
                   text:"Edit",
                   iconCls: "edit"
               },{
                   text: "Delete",
                   iconCls: "del"
               }]
           }
        },{
           text:"Units",
           iconCls:"unit",
           handler:function(){
                unit.win.show();
           }
        }]
    });

    treePanelM = new Ext.tree.TreePanel({
    	id: 'tree-panel_m',
        title: 'Measures',
        split: true,
        minSize: 150,
        region: 'center',
        autoScroll: true,
        rootVisible: false,
        lines: false,
        singleExpand: true,
        width:100,
        useArrows: true,
        tbar:[measuresToolBar],
        loader: new Ext.tree.TreeLoader({
            requestMethod:"GET",
            dataUrl:function() {return '/measures?objective_id='+objective.id}
        }),
        root: new Ext.tree.AsyncTreeNode()
    });

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [{
            xtype: 'box',
            region: 'north',
            applyTo: 'header',
            height: 30
        }, {
            region: 'west',
            title: 'Organizations and Strategies',
            split: true,
            width: 400,
            items:[toolBarOrgs,treePanelOrgs]
        }, {
            region: 'center',
            split: true,
            layout: 'border',
            width: 200,
            items:[treePanelPersp,treePanelM]
        }]
    });
});

