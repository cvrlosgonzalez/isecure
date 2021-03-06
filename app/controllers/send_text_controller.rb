class SendTextController < ApplicationController

    def text_alert_on
      p "Text alert is ON from method!!"
      @monitor = Cam.find(params[:id]) # this may not be Cam... but User.. since phone is attached to user.
      @monitor.update(text_alerts: true)
      monitoring = Firebase::Client.new("https://blistering-heat-6382.firebaseio.com/")
      response = monitoring.update("monitor/status", { :check => 'on', :text => 'on'}) #:save_alerts => 'yes',
      redirect_to cams_path
    end


    def text_alert_off
      p "Text alert is OFF from method!!"
      @monitor = Cam.find(params[:id])
      @monitor.update(text_alerts: false)
      monitoring = Firebase::Client.new("https://blistering-heat-6382.firebaseio.com/")
      response = monitoring.update("monitor/status", { :check => 'on', :text => 'off'}) #:save_alerts => 'yes',
      redirect_to cams_path
    end

    # GET /text_messages/new
    def new
      @text_message = TextMessage.new
      render :new
    end

    # POST /text_messages
    def create

    end

end
