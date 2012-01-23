Ext.define 'YABSCA.view.Viewport',
  extend: 'Ext.Viewport'
  layout: 'fit'
  initComponent: ->
    me = this

    Ext.apply me,
      items: [
        xtype: 'panel'
        id: 'viewport'
        title: 'Balanced ScoreCard Application'
        layout: 'border'
        tbar: [
          xtype: 'button'
          text: 'Settings'
          iconCls: 'tools'
          width: 100
          menu:
            xtype: 'menu'
            items: [
              text: 'Units'
              iconCls: 'unit'
              action: 'units'
            ,
              text: 'Responsibles'
              iconCls: 'responsible'
              action: 'responsibles'
            ]
        ]
        items: [
          region: 'west'
          title: 'Organizations and Strategies'
          width: 300
          layout: 'fit'
          items:
            xtype: 'organization_tree'
        ,
          region: 'center'
          title: 'Perspectives and Objectives'
          width: 200
          layout: 'border'
          split: true
          items: [
            region: 'north'
            layout: 'fit'
            height: 300
            items:
              xtype: 'perspective_tree'
          ,
            region: 'center'
            title: 'Measures'
            layout: 'fit'
            items:
              xtype: 'measure_tree'
          ]
        ]
      ]

    me.callParent arguments
