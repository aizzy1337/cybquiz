package wsb.edu.cybquiz.group.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wsb.edu.cybquiz.group.dto.GroupCreateResponseDto;
import wsb.edu.cybquiz.group.dto.GroupDto;
import wsb.edu.cybquiz.group.mapper.GroupMapper;
import wsb.edu.cybquiz.group.model.GroupEntity;
import wsb.edu.cybquiz.group.repo.GroupRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository repo;
    private final GroupMapper mapper;

    public GroupCreateResponseDto create(GroupDto dto) {
        String id = UUID.randomUUID().toString();
        String joinCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        GroupEntity entity = mapper.toEntity(dto);
        entity.setId(id);
        entity.setJoinCode(joinCode);
        if (entity.getQuizIds() == null) {
            entity.setQuizIds(new ArrayList<>());
        }
        if (entity.getUserIds() == null) {
            entity.setUserIds(new ArrayList<>());
        }
        if (dto.getAdminId() != null && !dto.getAdminId().isBlank() && !entity.getUserIds().contains(dto.getAdminId())) {
            entity.getUserIds().add(dto.getAdminId());
        }

        repo.save(entity);

        return new GroupCreateResponseDto(id, joinCode);
    }

    public GroupDto findById(String id) {
        String normalizedId = normalizeId(id);
        if (normalizedId == null) {
            throw new IllegalArgumentException("Group id is required");
        }

        GroupEntity entity = repo.findById(normalizedId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found: " + normalizedId));
        return mapper.toDto(entity);
    }

    public List<GroupDto> findByAdmin(String adminId) {
        return repo.findAll()
                .items()
                .stream()
                .filter(g -> g.getAdminId().equals(adminId))
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public List<GroupDto> findAll() {
        return repo.findAll()
                .items()
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public void addQuiz(String groupId, String quizId) {
        String normalizedGroupId = normalizeId(groupId);
        String normalizedQuizId = normalizeId(quizId);

        if (normalizedGroupId == null) {
            throw new IllegalArgumentException("groupId is required");
        }
        if (normalizedQuizId == null) {
            throw new IllegalArgumentException("quizId is required");
        }

        GroupEntity group = repo.findById(normalizedGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found: " + normalizedGroupId));
        if (group.getQuizIds() == null) {
            group.setQuizIds(new ArrayList<>());
        }
        if (!group.getQuizIds().contains(normalizedQuizId)) {
            group.getQuizIds().add(normalizedQuizId);
        }
        repo.save(group);
    }

    public void removeQuiz(String groupId, String quizId) {
        String normalizedGroupId = normalizeId(groupId);
        String normalizedQuizId = normalizeId(quizId);

        if (normalizedGroupId == null) {
            throw new IllegalArgumentException("groupId is required");
        }
        if (normalizedQuizId == null) {
            throw new IllegalArgumentException("quizId is required");
        }

        GroupEntity group = repo.findById(normalizedGroupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found: " + normalizedGroupId));
        if (group.getQuizIds() == null) {
            group.setQuizIds(new ArrayList<>());
        }
        group.getQuizIds().remove(normalizedQuizId);
        repo.save(group);
    }

    public void joinGroup(String groupId, String joinCode, String userId) {
        String normalizedGroupId = normalizeId(groupId);
        String normalizedJoinCode = normalizeJoinCode(joinCode);
        String normalizedUserId = normalizeId(userId);

        if (normalizedUserId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        GroupEntity group;
        if (normalizedJoinCode != null) {
            group = repo.findAll()
                    .items()
                    .stream()
                    .filter(g -> normalizeJoinCode(g.getJoinCode()) != null)
                    .filter(g -> normalizedJoinCode.equals(normalizeJoinCode(g.getJoinCode())))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Group not found for joinCode: " + normalizedJoinCode));
        } else if (normalizedGroupId != null) {
            group = repo.findById(normalizedGroupId)
                    .orElseThrow(() -> new IllegalArgumentException("Group not found: " + normalizedGroupId));
        } else {
            throw new IllegalArgumentException("joinCode or groupId is required");
        }

        if (group.getUserIds() == null) {
            group.setUserIds(new ArrayList<>());
        }

        if (!group.getUserIds().contains(normalizedUserId)) {
            group.getUserIds().add(normalizedUserId);
        }
        repo.save(group);
    }

    public List<GroupDto> findByUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (normalizedUserId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        return repo.findAll()
                .items()
                .stream()
            .filter(group -> group.getUserIds() != null && group.getUserIds().stream()
                .map(this::normalizeId)
                .anyMatch(normalizedUserId::equals))
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    private String normalizeId(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        if (normalized.length() >= 2 && normalized.startsWith("\"") && normalized.endsWith("\"")) {
            normalized = normalized.substring(1, normalized.length() - 1).trim();
        }

        return normalized.isBlank() ? null : normalized;
    }

    private String normalizeJoinCode(String value) {
        String normalized = normalizeId(value);
        return normalized == null ? null : normalized.toUpperCase();
    }
}
