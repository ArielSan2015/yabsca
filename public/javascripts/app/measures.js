var measure = new Object();

measure.id=0;
measure.url="";
measure.method="";

measure.frecuency_store=new Ext.data.ArrayStore({
   fields: ["id","name"],
   data: [[1,"daily"],[2,"weekly"],[3,"monthly"],[4,"bimonthly"],
          [5,"three-monthly"],[6,"four-monthly"],[7,"yearly"]]
});

measure.challenge_store=new Ext.data.ArrayStore({
   fields: ["id","name"],
   data: [[1,"increasing"],[2,"decreasing"]]
});

measure.form=new Ext.FormPanel({
    labelWidth:75,
    frame:true,
    title:"Measure",
    bodyStyle:'padding:5px 5px 0',
    width: 350,
    defaults: {width: 230},
    items:[new Ext.form.TextField({
        fieldLabel: "Name",
        id: "measure_name",
        name:"measure[name]",
        allowBlank: false
    }),new Ext.form.TextField({
        fieldLabel: "Code",
        id: "measure_code",
        name:"measure[code]"
    }), new Ext.form.TextArea({
        fieldLabel: "Description",
        id: "measure_description",
        name: "measure[description]"
    }), new Ext.form.ComboBox({
        fieldLabel: "Challenge",
        displayField: "name",
        valueField: "id",
        hiddenName:"measure[challenge]",
        name: "measure[challenge]",
        typeAhead: true,
        store: measure.challenge_store,
        mode: "local",
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus:true,
        valueNotFoundText:"Select a challenge...",
        emptyText: "Select a challenge..."
    }), new Ext.form.NumberField({
        fieldLabel: "Excellent",
        id: "measure_excellent",
        name: "measure[excellent]"
    }), new Ext.form.NumberField({
        fieldLabel: "Alert",
        id: "measure_alert",
        name: "measure[alert]"
    }), new Ext.form.ComboBox({
        fieldLabel: "Frecuency",
        displayField: "name",
        valueField: "id",
        hiddenName:"measure[frecuency]",
        name: "measure[frecuency]",
        typeAhead: true,
        store: measure.frecuency_store,
        mode: "local",
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus:true,
        valueNotFoundText:"Select a frecuency...",
        emptyText: "Select a frecuency..."
    }), new Ext.form.DateField({
        fieldLabel: "From",
        id: "measure_period_from",
        name:"measure[period_from]"
    }), new Ext.form.DateField({
        fieldLabel: "To",
        id: "measure_period_to",
        name:"measure[period_to]"
    }), new Ext.form.ComboBox({
        id:"measure_unit_id",
        fieldLabel: "Unit",
        name: "measure[unit_id]",
        store: unit.store,
        displayField: "name",
        valueField: "id",
        hiddenName:"measure[unit_id]",
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        selectOnFocus:true,
        mode: "remote",
        valueNotFoundText:"Select an unit...",
        emptyText: "Select an unit..."
    }),new Ext.form.Hidden({
        id:"measure_objective_ids",
        name:"measure[objective_ids][]"
    })]
});

measure.win=new Ext.Window({
    layout:'fit',
    width:400,
    height:500,
    closeAction:'hide',
    plain: true,
    items:[measure.form],
    buttons:[{
        text:'Save',
        iconCls:'save',
        handler: function(){
            measure.form.getForm().submit({
                url:measure.url,
                method:measure.method,
                success: function(){
                    measure.treePanel.getRootNode().reload();
                    measure.win.hide();
                },
                failure: function() {
                    Ext.Msg.alert("Error",
                    "Make sure about all data is correct.");
                }
            });
        }
    },{
        text:'Close',
        iconCls:'close',
        handler:function(){
            measure.win.hide();
        }
    }]
});

measure.toolBar=new Ext.Toolbar({
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
               iconCls: "edit",
               handler:function(){
                   if (measure.id>0){
                       measure.method="PUT";
                       measure.url="/measures/"+measure.id;
                       measure.form.getForm().load(
                            {method:'GET',
                             url:'/measures/'+measure.id+'/edit'});
                       measure.win.show();
                    }else{
                        Ext.Msg.alert("Error","You must select a measure");
                    }
               }
           },{
               text: "Delete",
               iconCls: "del",
               handler:function(){
                    if (measure.id>0){
                        general.deletion("/measures/"+measure.id,measure.treePanel);
                    }else{
                        Ext.Msg.alert("Error","You must select a measure");
                    }
               }
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

measure.treePanel = new Ext.tree.TreePanel({
    id: "tree-panel_m",
    title: "Measures",
    region: "west",
    split: true,
    autoScroll: true,
    rootVisible: false,
    lines: false,
    singleExpand: true,
    width:500,
    useArrows: true,
    tbar:[measure.toolBar],
    loader: new Ext.tree.TreeLoader({
        requestMethod:"GET",
        dataUrl:function() {return "/measures?objective_id="+objective.id}
    }),
    listeners:{
        click:function(n){
            measure.id=n.id;
            target.frec_store.setBaseParam("measure_id",measure.id);
            target.frec_store.load();
            target.store.setBaseParam("measure_id",measure.id);
            target.store.load();
            target.id=0;
        },
        load:function(n){
            measure.id=0;
            target.id=0;
            target.store.setBaseParam("measure_id",0);
            target.store.load();
        }
    },
    root: new Ext.tree.AsyncTreeNode()
});