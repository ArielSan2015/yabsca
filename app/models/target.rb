class Target < ActiveRecord::Base
  belongs_to :measure
  attr_accessor :to_order

  #transform the period in a Date to do ordering
  def to_order
    case measure.frecuency
      when Frecuency::Daily,Frecuency::Yearly
        period
      when Frecuency::Monthly
        Date.strptime("01"+"/"+period.split("-")[0]+"/"+period.split("-")[1], "%m/%d/%Y")
      when Frecuency::Weekly
        Date.strptime("01"+"/"+(period.split("-")[0].to_i/2).to_s+"/"+period.split("-")[1], "%m/%d/%Y")
      when Frecuency::Bimonthly,Frecuency::Three_monthly,Frecuency::Four_monthly
        Date.strptime("01"+"/"+period.split("-")[0]+"/"+period.split("-")[1], "%m/%d/%Y")
    end
  end

end
