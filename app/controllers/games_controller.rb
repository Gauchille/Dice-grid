class GamesController < ApplicationController
  skip_before_action :authenticate_user!


  def start
  end

  def end_game
    score_grid = {}
    rows = params[:game].values.each_cons(5).to_a[0]
    cols = grid_creator(rows)[0]
    diago = grid_creator(rows)[1]
    rows.each_with_index { |row, i| score_grid["row#{i}"] = score(row) }
    cols.each_with_index { |col, i| score_grid["col#{i}"] = score(col) }
    score_grid["diago"] = score(diago)
    score_grid["total"] = score_grid.values.sum + score(diago)
    render json: { scores: score_grid }
  end

  def grid_creator(array)
    i = 0
    y = 4
    diago = []
    cols = []
    while i < 5
      col = []
      array.each do |row|
        col << row[i]
        if diago.size < 5
          diago << row[y]
          y -= 1
        end
      end
      cols << col
      i += 1
    end
    return [cols, diago]
  end

  def score(array)
    previous = nil
    score = 0
    current_array = []
    array.each do |element|
      if element == previous
        current_array << element
      else
        score += score_math(current_array) if current_array.size > 1
        current_array = [element]
      end
      previous = element
    end
    score += score_math(current_array) if current_array.size > 1
    return score.zero? ? -5 : score
  end

  def score_math(array)
    case array.length
    when 2
      return 2
    when 3
      return 3
    when 4
      return 8
    when 5
      return 10
    end
  end
end
