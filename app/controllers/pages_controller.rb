class PagesController < ApplicationController
  def home
  end

  def end_game
    # récuperer le json et faire mon calcul
    grid = params
    puts grid
  end
end
