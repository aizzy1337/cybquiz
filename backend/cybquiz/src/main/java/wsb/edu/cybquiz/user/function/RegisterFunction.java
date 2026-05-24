package wsb.edu.cybquiz.user.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.user.dto.UserCreateResponseDto;
import wsb.edu.cybquiz.user.dto.UserDto;
import wsb.edu.cybquiz.user.service.UserService;

import java.util.function.Function;

@Component("auth/register")
@RequiredArgsConstructor
public class RegisterFunction implements Function<UserDto, UserCreateResponseDto> {

    private final UserService userService;

    @Override
    public UserCreateResponseDto apply(UserDto dto) {
        return userService.createUser(dto);
    }
}