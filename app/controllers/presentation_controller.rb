class PresentationController < ApplicationController
  before_filter :require_user

  def org_and_strat

    return_data=[]
    if params[:node].match(/src:root/)
      data=Organization.find_all_by_organization_id(0)
      return_data=join_nodes_orgs(data)
    elsif params[:node].match(/src:orgs/)
      id=params[:node].sub(/src:orgs/,"").to_i
      data=Organization.find_all_by_organization_id(id)
      if data.empty?
        data=Strategy.find_all_by_organization_id(id)
        return_data=join_nodes_strat(data)
      else
        return_data=join_nodes_orgs(data)
      end
    end
    
    respond_to do |format|
      format.json { render :json => return_data }
    end    
  end

  def persp_and_objs

    return_data=[]
    if params[:node].match(/src:root/)
      data=Perspective.find_all_by_strategy_id(params[:strategy_id])
      return_data=join_nodes_perspectives(data)
    elsif params[:node].match(/src:persp/)
      id=params[:node].sub(/src:persp/,"").to_i
      data=Objective.find_all_by_perspective_id(id)
      return_data=join_nodes_objs(data)
    end

    respond_to do |format|
      format.json { render :json => return_data }
    end

  end

  def get_targets
    measure=Measure.find(params[:measure_id])

    respond_to do |format|
      format.json { render :json => measure.get_periods }
    end

  end

  def generate_chart

    targets=Target.find(:all,:conditions =>
        ["measure_id=? and achieved is not null",params[:measure_id]])

    sort_targets=targets.sort_by { |t| t.to_order }

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

  def generate_gantt

    initiatives=Initiative.find_all_by_objective_id(params[:objective_id])

    period=initiatives.first.beginning..initiatives.last.end

    categories=[]
    period.each { |i| categories.push(i.beginning_of_month) }

    categories.uniq!

    return_data={}
    return_data[:categories]=categories.map do |item|
      {
        :start=>item.beginning_of_month,
        :end => item.end_of_month,
        :name => Date::MONTHNAMES[item.month]
      }
    end
    
    return_data[:processes]=initiatives.map do |item|
      {:name => item.name, :id => item.id}
    end

    return_data[:tasks]=initiatives.map do |item|
      {:start => item.beginning, :end => item.end,
       :processId=>item.id, :name => item.name}
    end

    respond_to do |format|
      format.xml {render :xml => fusionchart_xml_gantt(return_data)}
    end
  end
  
end