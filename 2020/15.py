def do_the_thing(nums, end):
    spoken_numbers = {}

    for i, v in enumerate(nums):
        spoken_numbers[v] = [i+1]

    last_spoken = nums[len(nums) - 1]

    for current_turn in range(4, end + 1):
        # print(current_turn)
        last_times_spoken = spoken_numbers[last_spoken]
        new_num = 0 if len(last_times_spoken) < 2 else last_times_spoken[len(
            last_times_spoken) - 1] - last_times_spoken[len(last_times_spoken) - 2]
        last_spoken = new_num
        p = spoken_numbers[new_num] if new_num in spoken_numbers else list()
        spoken_numbers[new_num] = p[len(p)-1:] + [current_turn]

    return last_spoken


numbers = [0, 3, 6]

result = do_the_thing(numbers, 30000000)

print(result)
