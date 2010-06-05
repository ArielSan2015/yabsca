class CreateMeasures < ActiveRecord::Migration
  def self.up
    create_table :measures do |t|
      t.string :name
      t.text :description
      t.float :target
      t.float :satisfactory
      t.float :alert
      t.string :frecuency
      t.belongs_to :unit
      t.belongs_to :objective
      
      t.timestamps
    end
  end

  def self.down
    drop_table :measures
  end
end
