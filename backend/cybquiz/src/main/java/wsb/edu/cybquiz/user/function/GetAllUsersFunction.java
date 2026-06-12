package wsb.edu.cybquiz.user.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.user.dto.UserResponseDto;
import wsb.edu.cybquiz.user.service.UserService;

import java.util.List;
import java.util.function.Supplier;

@Component("getAllUsers")
@RequiredArgsConstructor
public class GetAllUsersFunction implements Supplier<List<UserResponseDto>> {

    private final UserService userService;

    @Override
    public List<UserResponseDto> get() {
        return userService.findAllSafe();
    }
}