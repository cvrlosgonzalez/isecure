class CamsController < ApplicationController
  before_action :set_cam, only: [:show, :edit, :update, :destroy]

  # GET /cams
  # GET /cams.json
  def index
    @cams = Cam.all
    # @alerts = Alert.all.find_by(cam_id: params[:id]).page(params[:page]).per(12)
  end

  # GET /cams/1
  # GET /cams/1.json
  def show
    # @alerts = Alert.order(created_at: :desc).page params[:page]
    @alerts = @cam.alerts.order(created_at: :desc).page params[:page]
    # raise
    #  @alerts = Alert.page(params[:page]).per(12)
    @user = current_user
  end

  # GET /cams/new
  def new
    @cam = Cam.new
    @cam.user_id = current_user.id
  end

  # GET /cams/1/edit
  def edit
  end

  # POST /cams
  # POST /cams.json
  def create
    @cam = Cam.new(cam_params)
    @cam.user_id = current_user.id

    respond_to do |format|
      if @cam.save
        format.html { redirect_to cams_path, notice: 'Cam was successfully created.' }
        format.json { render :show, status: :created, location: cams_path }
      else
        format.html { render :new }
        format.json { render json: @cam.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cams/1
  # PATCH/PUT /cams/1.json
  def update
    respond_to do |format|
      if @cam.update(cam_params)
        format.html { redirect_to cams_path, notice: 'Cam was successfully updated.' }
        format.json { render :show, status: :ok, location: cams_path }
      else
        format.html { render :edit }
        format.json { render json: @cam.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cams/1
  # DELETE /cams/1.json
  def destroy
    @cam.destroy
    respond_to do |format|
      format.html { redirect_to cams_url, notice: 'Cam was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cam
      @cam = Cam.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def cam_params
      params.require(:cam).permit(:title, :alert)
    end
end
