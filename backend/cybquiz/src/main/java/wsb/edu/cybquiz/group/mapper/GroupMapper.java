package wsb.edu.cybquiz.group.mapper;

import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.group.dto.GroupDto;
import wsb.edu.cybquiz.group.model.GroupEntity;

import java.util.ArrayList;

@Component
public class GroupMapper {

    public GroupDto toDto(GroupEntity entity) {
        return GroupDto.builder()
                .id(entity.getEffectiveId())
                .name(entity.getName())
                .adminId(entity.getAdminId())
                .joinCode(entity.getJoinCode())
                .quizIds(entity.getQuizIds() != null ? new ArrayList<>(entity.getQuizIds()) : new ArrayList<>())
                .userIds(entity.getUserIds() != null ? new ArrayList<>(entity.getUserIds()) : new ArrayList<>())
                .build();
    }

    public GroupEntity toEntity(GroupDto dto) {
        return GroupEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .adminId(dto.getAdminId())
                .joinCode(dto.getJoinCode())
                .quizIds(dto.getQuizIds() != null ? new ArrayList<>(dto.getQuizIds()) : new ArrayList<>())
                .userIds(dto.getUserIds() != null ? new ArrayList<>(dto.getUserIds()) : new ArrayList<>())
                .build();
    }
}