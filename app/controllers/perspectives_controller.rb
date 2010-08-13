class PerspectivesController < ApplicationController

  def edit
    @perspective=Perspective.find(params[:id])

    return_data={}
    return_data[:success]=true
    return_data[:data]={"perspective[name]" => @perspective.name,
                        "perspective[strategy_id]" => @perspective.strategy_id}
                      
    respond_to do |format|
      format.json { render :json => return_data }
    end
end

  def create
    self.default_creation(Perspective, params[:perspective],
      StrategyRule,"strategy_id="+params[:strategy_id])
  end

  def update
    self.default_updating(Perspective, params[:id], params[:perspective],
      PerspectiveRule,"perspective_id="+params[:perspective_id])
  end

  def destroy
    self.default_destroy(Perspective, params[:id],
      PerspectiveRule,"perspective_id="+params[:perspective_id])
  end
end
