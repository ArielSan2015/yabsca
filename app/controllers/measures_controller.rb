class MeasuresController < ApplicationController

  def new
    @measures=Measure.new
  end

  def edit
    @measure=Measure.find(params[:id])

    return_data={}
    return_data[:success]=true
    return_data[:data]={"measure[name]" => @measure.name,
                        "measure[description]" => @measure.description,
                        "measure[target]" => @measure.target,
                        "measure[satisfactory]" => @measure.satisfactory,
                        "measure[alert]" => @measure.alert,
                        "measure[frecuency]" => @measure.frecuency,
                        "measure[unit_id]" => @measure.unit_id,
                        "measure[objective_id]" => @measure.objective_id}

    respond_to do |format|
      format.json { render :json => return_data }
    end
  end

  def create
    self.default_creation(Measure, params[:measure])
  end

  def update
    self.default_updating(Measure, params[:id], params[:measure])
  end

  def destroy
    self.default_destroy(Measure, params[:id])
  end
  
end
