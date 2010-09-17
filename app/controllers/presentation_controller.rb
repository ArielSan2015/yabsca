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
        roles=current_user.roles

        unless roles.find_all_by_id(1).empty? # Admin Role
          data=Strategy.find_all_by_organization_id(id)
        else # Other Roles
          strats=StrategyRule.find_all_by_role_id(roles)
          data=strats.collect do |i|
            Strategy.find_all_by_id(i.strategy_id,
              :conditions=>["organization_id=?",id])
          end.flatten
        end
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
      roles=current_user.roles
      unless roles.find_all_by_id(1).empty? # Admin Role
        data=Perspective.find_all_by_strategy_id(params[:strategy_id])
      else # Other Roles
        persps=PerspectiveRule.find_all_by_role_id(roles)
        data=persps.collect do |i|
          Perspective.find_all_by_id(i.perspective_id,
            :conditions=>["strategy_id=?",params[:strategy_id]])
        end.flatten
      end
      return_data=join_nodes_perspectives(data)
    elsif params[:node].match(/src:persp/)
      id=params[:node].sub(/src:persp/,"").to_i
      roles=current_user.roles
      unless roles.find_all_by_id(1).empty? # Admin Role
        data=Objective.find_all_by_perspective_id(id)
      else # Other Roles
        objs=ObjectiveRule.find_all_by_role_id(roles)
        data=objs.collect do |i|
          Objective.find_all_by_id(i.objective_id,
            :conditions=>["perspective_id=?",id])
        end.flatten
      end
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

    initiatives=Initiative.find_all_by_objective_id(params[:objective_id],
        :conditions=>["initiative_id=0"], :order=>:beginning)
    return_data=[]
    initiatives.each do |initiative|
      return_data.push({:id=>initiative.id,
          :name=>initiative.name,:startdate=>initiative.beginning+1,
          :tasks=>initiative.initiatives.collect{|init|
            {:id=>init.id,:name=>init.name,
             :date=>init.beginning+1,:duration=>(init.end-init.beginning).to_i*8+8,
             :completed=>init.completed,
             :tasks=>init.initiatives.collect{|i|
               {
                 :id=>i.id,:name=>i.name,:date=>i.beginning+1,:duration=>(i.end-i.beginning).to_i*8+8,
                 :completed=>i.completed
               }
             }
             }
          }})      
    end

    respond_to do |format|
      format.json {render :json => return_data}
    end
  end

  def upload_file
    parse_excel(params["form-file"])
    respond_to do |format|
      format.html
    end
  end
  
end
