class PresentationController < ApplicationController

  def org_and_strat

    @organizations=Organization.find_all_by_organization_id(0)

    @nodes=[]
    unless params[:organization_id].to_i==0
      @organization=Organization.find(params[:organization_id])
      nodes_expanded(@organization)
    end

    return_data=[]
    return_data=join_nodes_orgs(@organizations)

    respond_to do |format|
      format.json { render :json => return_data }
    end    
  end

  def persp_and_objs

    @perspectives=Perspective.find_all_by_strategy_id(params[:strategy_id])

    return_data=[]
    return_data=join_nodes_perspectives(@perspectives)

    respond_to do |format|
      format.json { render :json => return_data }
    end

  end

  def get_targets
    measure=Measure.find(params[:measure_id])

    period=measure.period_from..measure.period_to

    multi_month=lambda { |u,x| u.month%x==0 ? u.month/x : nil }
    
    frecuency=[]
    case measure.frecuency
      when Frecuency::Daily
        period.each { |u| frecuency.push(u) }
      when Frecuency::Weekly
        period.each { |u| frecuency.push(u.strftime("%W")+"-"+u.year.to_s) }
      when Frecuency::Monthly
        period.each { |u| frecuency.push(u.month.to_s+"-"+u.year.to_s) }
      when Frecuency::Bimonthly,Frecuency::Three_monthly,Frecuency::Four_monthly
        period.each do |u|
          frecuency.push(multi_month.call(u,measure.frecuency-1).to_s+"-"+u.year.to_s) unless
                                                multi_month.call(u,measure.frecuency-1).nil?
        end
      when Frecuency::Yearly
        period.each { |u| frecuency.push(u.year) }
    end

    frecuency.uniq!

    return_data={}
    return_data[:data]=frecuency.collect {|u|{
        :name => u
      }}

    respond_to do |format|
      format.json { render :json => return_data }
    end

  end

  def generate_chart

    @targets=Target.find_all_by_measure_id(params[:measure_id])

    sort_targets=@targets.sort_by { |t| t.to_order }

    return_data=sort_targets.map do |item|
      {
        :name => item.period,
        :value => item.achieved,
        :color => get_fchart_color
      }
    end

    respond_to do |format|
      format.xml {render :xml => fusionchart_xml(return_data)}
    end
  end
  
end